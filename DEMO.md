# Demo
Simple steps to execute an auction
## Setup
* First we have to create our users: Cell the seller and Babidi the bidder. we use the `POST /user` endpoint to create our users.
We need a password and an entropy string to create the wallet keys.
![Screenshot from 2023-08-14 06-35-38](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/62428e81-2481-4ed7-b42c-4b3a491baa3b)
![Screenshot from 2023-08-14 06-35-56](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/cab66bfe-d602-4fcc-87e4-10a1622fd7ef)
<br>
* If we want to use other endpoints we need a JWT. We can use `POST /auth` to authenticate a user and obtain a JWT.
  
### All endpoints needs the JWT of the user. It should be in the HEADER as `Authorization: Bearer ${the_token}. The only expections are create user and login`
<br>

![Screenshot from 2023-08-14 06-36-19](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/28a50809-7819-4ea0-b93c-6c207275b969)
<br>
We can list our users with `GET /user` in order to obtain the user addresses and transfer some SepETH to them.
<br>

![Screenshot from 2023-08-14 08-54-07](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/21cfe996-8336-40c9-b347-81d86e663210)
<br>
Once the users have SepETH they can mint nfts and token. Cell will mint an nft and Babidi some tokens:

![Screenshot from 2023-08-14 06-47-50](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/1a584109-4450-497f-ba35-fe2195ee8ccd)

![Screenshot from 2023-08-14 06-48-23](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/7dd05500-9e18-4014-b81a-c4cda48b37f1)

![Screenshot from 2023-08-14 06-40-34](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/7f9a61b2-f1e1-4ebc-8f8b-dfca312c23d8)

![Screenshot from 2023-08-14 06-45-42](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/a117b071-dbd5-4e4c-9069-079a7abe88b9)

## Auction

* Now that we are set up, we can create an auction. Cell will offer its nft in an auction. He needs to know the token id in the contract. We can use `GET /nfts` to list the nft ids.

![Screenshot from 2023-08-14 06-54-46](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/4f64d34e-3e46-443a-9645-04c0e905b604)

<br>
* With the tokenId we can create an auction calling `POST /sellOffers`.

![Screenshot from 2023-08-14 06-55-18](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/0206df77-12d0-484f-904a-19a03bc22ca5)

* And list them with `GET /sellOffers`

![Screenshot from 2023-08-14 06-56-24](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/fdf21cab-9399-489e-9930-bde18ce27b4b)

<br>
* Once the auction is created we can bid with `POST /bids`

![Screenshot from 2023-08-14 06-57-37](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/7b091cc0-93c8-4ad7-a90f-cd384a0f69d2)

<br>
* Finally, Cell can close the auction and transact with Babidi calling `POST /sellOffers/close `

![Screenshot from 2023-08-14 09-16-38](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/9513aa33-970d-4dea-a32f-47f5c35438d8)
![Screenshot from 2023-08-14 07-05-21](https://github.com/matiasADiazPerez/NFT-Marketplace/assets/130945302/05a100ca-e0ed-4d8c-979b-16474bf4b2de)




