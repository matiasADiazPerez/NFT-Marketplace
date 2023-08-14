# MarketPlace Challege

This API allows users to create, sell, offers, and auctions for NFTs (Non-Fungible Tokens) and enables other users to place bids or purchase these NFTs using ERC20 tokens. 
The API is built using the NestJS framework and utilizes the ThirdWeb SDK to connect to the Sepolia test net and interact with the smart contracts MockERC721, MockERC20, and Marketplace.

This challenge was created with: 
* Linux ubuntu `20.04 x86_64`
* nodejs version: `v20.3.1`
* npm version: `9.6.7`


## Getting Started

To start the application, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running:
```
npm install
```
3. Configure the necessary environment variables for connecting to the Sepolia test net and contract addresses by create a .env:
```
API_KEY=${ThirdWeb SECRET KEY}
CLIENT_KEY=${ThirdWeb CLIENT KEY}
JWT_SECRET='a secret string'
ERC721_CONTRACT='0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff'
ERC20_CONTRACT='0xbd65c58D6F46d5c682Bf2f36306D461e3561C747'
FINISH_CONTRACT='0x597C9bC3F00a4Df00F85E9334628f6cDf03A1184'
```
To get the `API_KEY` and `CLIENT_KEY` of the ThirdWeb API please follow [these instructions](https://portal.thirdweb.com/api-keys#creating--managing-your-api-keys-via-the-dashboard-settings-tab). It may seem annoying but with this we don't need an infura or local eth node.

4. Start the application using the command:
```
npm start
```

## Note

* The smart contracts: MockERC20, MockERC721 and Marketplace, were uploaded to an ipfs service by thirdweb to get the ABI in the API. Sometimes these ipfs services may fail. If this is the case a warning will be printed. Retry the request until the ipfs node works.
* Ideally no wallet key should be stored in the app db. But this is a simple backend solution. A production ready solution should store the users keys in a secret manager service. Or use a wallet provider and call the contracts in the client side (frontend).
* The auction and sales are represented by an entity called `SellOffer`. A `SellOffer` have an internal state that indicates what actions can be done to it:
    * OnSale: Indicates that the nft is on sale and can be purchased immediately.
    * OnAuction: Indicates that the nft is on auction and bids can be placed. Only the owner can close the auction.
    * Closed: Indicates that the auction or sale already ended.
      
## Usage
To see the full documentation of the API run:
``` npm run doc ```
Needs npx. The documentation will be displayed in a web app running in `localhost:8080`

### The API

- Creating Users: Users can be created and authenticated in the API to use all the others endpoints.

- Creating Sell Offers: Users can create sell offers for their NFTs. Specify the NFT, price, and other relevant details.

- Placing Bids: Users can place bids on NFTs that are up for auction. Bids are made using ERC20 tokens.

- Purchasing NFTs: Users can purchase NFTs that are listed for sale using ERC20 tokens.

  A Demo for a simple auction can be seen [here](DEMO.md)

## Testing

This repository includes unit tests for the main modules: `sellOffers`, `bids`, and `nfts`. To run the unit tests, use the following command:

```bash
npm test
```

