import { IsNumber, IsOptional } from 'class-validator';

export enum AuctionState {
  OnSale,
  OnAuction,
  Adjudicated,
  Closed,
}

export class CreateSellOfferDto {
  @IsNumber()
  tokenId: number;
  @IsNumber()
  @IsOptional()
  price?: number;
  @IsNumber()
  @IsOptional()
  minOffer?: number;
}

export class SellOffer extends CreateSellOfferDto {
  userId: number;
  currentBid: number;
  auctionState: AuctionState;
  finishAuctionTx: string;
  highestBidder: number;
  createdAt: Date;
  updatedAt: Date;
  DeletedAt?: Date;

  constructor(values: CreateSellOfferDto, userId: number) {
    super();
    Object.assign(this, values);
    this.auctionState = values.price
      ? AuctionState.OnSale
      : AuctionState.OnAuction;
    this.currentBid = this.minOffer || 0;
    this.userId = userId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
