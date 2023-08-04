import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid, CreateBidDto } from 'models/bids.entity';
import { Db } from 'src/shared/db/db.service';
import { Client } from 'src/shared/clients/clients.service';
import { AuctionState, SellOffer } from 'models/sellOffer.entity';

@Injectable()
export class BidsService {
  constructor(private db: Db, private client: Client) {}
  private async _buyOffer(userId: number, offer: SellOffer) {
    const bidder = this.db.getUser(userId);
    if (!bidder) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const buyInput = {
      tokenId: offer.tokenId.toString(),
      bid: offer.price.toString(),
    };
    const seller = this.db.getUser(offer.userId);
    const approveToken = this.client.approveToken(
      bidder.userKey,
      process.env.FINISH_CONTRACT,
      buyInput.bid,
    );
    const approveNft = this.client.approveNft(
      seller.userKey,
      process.env.FINISH_CONTRACT,
      buyInput.tokenId,
    );
    await Promise.all([approveToken, approveNft]);
    const ans = await this.client.finishAuction(
      bidder.userKey,
      seller.userKey,
      buyInput,
    );
    if (ans['transactionHash']) {
      offer.finishAuctionTx = String(ans['transactionHash']);
    }
    offer.auctionState = AuctionState.Closed;
  }

  async create(createBidDto: CreateBidDto, userId: number) {
    try {
      const offer = this.db.getSellOffer(createBidDto.sellOfferId);
      if (!offer) {
        throw new HttpException('Offer does not exist', HttpStatus.NOT_FOUND);
      }
      switch (offer.auctionState) {
        case AuctionState.Adjudicated || AuctionState.Closed:
          throw new HttpException(
            'Offer does not accept more bids',
            HttpStatus.BAD_REQUEST,
          );
        case AuctionState.OnSale:
          await this._buyOffer(userId, offer);
          break;
        case AuctionState.OnAuction:
          if (createBidDto.bidAmount < offer.currentBid) {
            throw new HttpException(
              'bid amount is less than the current high',
              HttpStatus.BAD_REQUEST,
            );
          }
          offer.currentBid = createBidDto.bidAmount;
          offer.highestBidder = userId;
          break;
        default:
          throw new HttpException(
            'The offer is in an unknown state',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
      const newBid: Bid = new Bid(createBidDto, userId);
      this.db.bids.push(newBid);
      return this.db.lastBidIndex();
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.db.bids.filter((bid) => {
      return bid.DeletedAt !== null;
    });
  }

  findOne(id: number) {
    try {
      return this.db.getBid(id);
    } catch (err) {
      throw err;
    }
  }

  update(id: number, updateBidDto: UpdateBidDto) {
    try {
      const bid = this.db.getBid(id);
      const newBid = Object.assign(bid, updateBidDto);
      return newBid;
    } catch (err) {
      throw err;
    }
  }
  remove(id: number) {
    try {
      const bid = this.db.getBid(id);
      bid.DeletedAt = new Date();
      return bid;
    } catch (err) {
      throw err;
    }
  }
}
