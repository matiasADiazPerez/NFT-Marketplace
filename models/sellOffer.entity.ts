import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export enum AuctionState {
  OnSale,
  OnAuction,
  Closed,
}

export class CreateSellOfferDto {
  @IsInt()
  @Min(0)
  tokenId: number;
  @IsPositive()
  @IsOptional()
  price?: number;
  @IsPositive()
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

export class CloseDto {
  @Min(0)
  sellOfferId: number;
}
