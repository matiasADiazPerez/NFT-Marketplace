import { Injectable } from '@nestjs/common';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Sepolia } from '@thirdweb-dev/chains';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

@Injectable()
export class ClientsService extends ThirdwebSDK {
  constructor() {
    super(Sepolia, {
      secretKey:
        'E0BlJpurpl66Sm8LYS7nmBZ3kQI4hL26ViE-Rrnd8Sx1rquMbFZLl8AjdIecKSt5IKK_nlmXukC__jbAkaeEKg',
    });
  }
  public async mint(): Promise<any> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // It will prompt user for account connections if it isnt connected
      const signer = provider.getSigner();
      console.log('Account:', await signer.getAddress());
      const contract = await this.getContract(
        '0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff',
      );
      console.log(contract.abi);
      const ans = await contract.call('mint', [
        '0xAd2A6C33946410EeF6Dc0e21b6CF1089D821C623',
      ]);
      return ans;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
