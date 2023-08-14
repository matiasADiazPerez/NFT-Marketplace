import { Injectable } from '@nestjs/common';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Sepolia } from '@thirdweb-dev/chains';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { BigNumber } from 'ethers';
import { eth, Receipt, utils } from 'web3';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

interface FinishAuctionInput {
  tokenId: string;
  bid: string;
}

@Injectable()
/** Client used to call the smart contract in the Sepolia test network */
export class Client {
  /** Internal method that creates the bidder signature of the transaction */
  private async _getBidderSign(inputs: FinishAuctionInput, privateKey: string) {
    const hashMessage = utils.sha3(
      utils.encodePacked(
        { value: process.env.ERC721_CONTRACT, type: 'address' },
        { value: process.env.ERC20_CONTRACT, type: 'address' },
        { value: inputs.tokenId, type: 'uint256' },
        { value: inputs.bid, type: 'uint256' },
      ),
    );
    const signedMsg = eth.accounts.sign(hashMessage, privateKey);
    return signedMsg;
  }
  /** Internal method that creates the seller signature of the transaction */
  private async _getSellerSign(bidderSignedMsg: string, privateKey: string) {
    const hashMessage = utils.sha3(bidderSignedMsg);
    const signedMsg = eth.accounts.sign(hashMessage, privateKey);
    return signedMsg;
  }
  /** Internal method that calls a write method of a given contract with the given inputs */
  private async _callContract(
    privateKey: string,
    input: Array<any>,
    contractAddr: string,
    method: string,
  ): Promise<any> {
    try {
      const sdk = ThirdwebSDK.fromPrivateKey(privateKey, Sepolia, {
        secretKey: process.env.CLIENT_KEY,
      });
      const contract = await sdk.getContract(contractAddr);
      const ans = await contract.call(method, input);
      return ans;
    } catch (err) {
      throw err;
    }
  }
  /** Internal method that calls a read method of a given contract */
  private async _readContract(
    input: Array<any>,
    contractAddr: string,
    method: string,
  ): Promise<any> {
    const sdk = new ThirdwebSDK(Sepolia, { secretKey: process.env.CLIENT_KEY });
    const contract = await sdk.getContract(contractAddr);
    const ans = await contract.call(method, input);
    return ans;
  }
  /** Calls the ownerOf method of the MockERC721 contract to know the owner of a nft*/
  async ownerOf(tokenId: string): Promise<any> {
    const res = await this._readContract(
      [tokenId],
      process.env.ERC721_CONTRACT,
      'ownerOf',
    );
    return res;
  }
  /** Calls the method of the MockERC721 contract to mint a nft or the MockERC20 contract to mint the `amount` tokens */
  async mint(key: string, toAddress: string, amount?: string): Promise<any> {
    const addr = amount
      ? process.env.ERC20_CONTRACT
      : process.env.ERC721_CONTRACT;
    const input = amount
      ? [toAddress, utils.toWei(amount, 'ether')]
      : [toAddress];
    const res = await this._callContract(key, input, addr, 'mint');
    return res;
  }
  /** Gets the amount of ERC20 tokens owned by a user */
  async getTokens(userAddr: string): Promise<any> {
    const balance: BigNumber = await this._readContract(
      [userAddr],
      process.env.ERC20_CONTRACT,
      'balanceOf',
    );
    return utils.fromWei(balance.toBigInt(), 'ether');
  }
  /** Gets the ids of the ERC721 nfts owned by a user */
  async getNfts(userAddr: string): Promise<any> {
    const balance: BigNumber = await this._readContract(
      [userAddr],
      process.env.ERC721_CONTRACT,
      'balanceOf',
    );
    const promises = Array.from(
      { length: balance.toNumber() },
      async (_, i) => {
        const promise: Promise<BigNumber> = this._readContract(
          [userAddr, i.toString()],
          process.env.ERC721_CONTRACT,
          'tokenOfOwnerByIndex',
        );

        return promise;
      },
    );
    const allResBigNumber = await Promise.all(promises);
    const allRes = allResBigNumber.map((value) => value.toNumber());
    return allRes;
  }
  /** Approves the `amount` of tokens to be transfered to the `toAddress` address */
  async approveToken(key: string, toAddress: string, amount: string) {
    const res = this._callContract(
      key,
      [toAddress, utils.toWei(amount, 'ether')],
      process.env.ERC20_CONTRACT,
      'approve',
    );
    return res;
  }
  /** Approves the transfer of a nft to the `toAddress` address */
  async approveNft(key: string, toAddress: string, tokenId: string) {
    const res = this._callContract(
      key,
      [toAddress, tokenId],
      process.env.ERC721_CONTRACT,
      'approve',
    );
    return res;
  }
  /** calls the finisAuction method of the Marketplace contract to execute the transaction of nft for tokens. */
  async finishAuction(
    bidderKey: string,
    sellerKey: string,
    input: FinishAuctionInput,
  ) {
    const bidderSignature = await this._getBidderSign(input, bidderKey);
    const sellerSignature = await this._getSellerSign(
      bidderSignature.signature,
      sellerKey,
    );
    const inputArr = [
      [
        process.env.ERC721_CONTRACT,
        process.env.ERC20_CONTRACT,
        input.tokenId,
        input.bid,
      ],
      bidderSignature.signature,
      sellerSignature.signature,
    ];
    const res: Receipt = await this._callContract(
      bidderKey,
      inputArr,
      process.env.FINISH_CONTRACT,
      'finishAuction',
    );
    return res;
  }
}
