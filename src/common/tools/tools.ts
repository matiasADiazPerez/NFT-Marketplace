import { Client } from 'src/shared/clients/clients.service';
import { AuctionState, SellOffer } from 'models/sellOffer.entity';
import { User } from 'models/users.entity';
import { utils } from 'web3';

export const finishAuction = async (
  seller: User,
  bidder: User,
  offer: SellOffer,
  client: Client,
) => {
  const bid =
    offer.auctionState === AuctionState.OnSale ? offer.price : offer.currentBid;
  const weiBid = utils.toWei(bid.toString(), 'ether');
  const buyInput = {
    tokenId: offer.tokenId.toString(),
    bid: weiBid,
  };

  const approveToken = client.approveToken(
    bidder.userKey,
    process.env.FINISH_CONTRACT,
    buyInput.bid,
  );
  const approveNft = client.approveNft(
    seller.userKey,
    process.env.FINISH_CONTRACT,
    buyInput.tokenId,
  );
  await Promise.all([approveToken, approveNft]);
  const ans = await client.finishAuction(
    bidder.userKey,
    seller.userKey,
    buyInput,
  );
  if (ans['transactionHash']) {
    offer.finishAuctionTx = String(ans['transactionHash']);
  }
  offer.auctionState = AuctionState.Closed;
};
