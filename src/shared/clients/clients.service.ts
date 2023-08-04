import { Injectable } from '@nestjs/common';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Sepolia } from '@thirdweb-dev/chains';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { BigNumber, Wallet } from 'ethers';
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
export class Client {
  private async _getBidderSign(inputs: FinishAuctionInput, privateKey: string) {
    const hashMessage = utils.sha3(
      utils.encodePacked(
        { value: process.env.ERC721_CONTRACT, type: 'address' },
        { value: process.env.ERC20_CONTRACT, type: 'address' },
        { value: inputs.tokenId, type: 'uint256' },
        { value: inputs.bid, type: 'uint256' },
      ),
    );
    console.log('hash msg');
    console.log(hashMessage);
    const signedMsg = eth.accounts.sign(hashMessage, privateKey);
    return signedMsg;
  }
  private async _getSellerSign(bidderSignedMsg: string, privateKey: string) {
    const hashMessage = utils.sha3(bidderSignedMsg);
    console.log('hash msg 2');
    console.log(hashMessage);
    const signedMsg = eth.accounts.sign(hashMessage, privateKey);
    return signedMsg;
  }
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
      console.log(err);
      throw err;
    }
  }

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

  async ownerOf(tokenId: string): Promise<any> {
    const res = await this._readContract(
      [tokenId],
      process.env.ERC721_CONTRACT,
      'ownerOf',
    );
    return res;
  }
  async mint(key: string, toAddress: string, amount?: string): Promise<any> {
    const addr = amount
      ? process.env.ERC20_CONTRACT
      : process.env.ERC721_CONTRACT;
    const input = amount ? [toAddress, amount] : [toAddress];
    const res = await this._callContract(key, input, addr, 'mint');
    return res;
  }

  async getNfts(userAddr: string): Promise<any> {
    const balance: BigNumber = await this._readContract(
      [userAddr],
      process.env.ERC721_CONTRACT,
      'balanceOf',
    );
    const promises = Array.from(
      { length: balance.toNumber() },
      async (_, i) => {
        const promise = await this._readContract(
          [userAddr, i.toString()],
          process.env.ERC721_CONTRACT,
          'tokenOfOwnerByIndex',
        );
        console.log(promise);
        return promise;
      },
    );
    const allRes = Promise.all(promises);
    return allRes;
  }
  async approveToken(key: string, toAddress: string, amount: string) {
    const res = this._callContract(
      key,
      [toAddress, amount],
      process.env.ERC20_CONTRACT,
      'approve',
    );
    return res;
  }
  async approveNft(key: string, toAddress: string, tokenId: string) {
    const res = this._callContract(
      key,
      [toAddress, tokenId],
      process.env.ERC721_CONTRACT,
      'approve',
    );
    return res;
  }
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
