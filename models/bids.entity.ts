import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  sellOfferId: number;
  @IsNumber()
  bidAmount: number;
}

export class Bid extends CreateBidDto {
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  DeletedAt?: Date;

  constructor(values: CreateBidDto, userId: number) {
    super();
    Object.assign(this, values);
    this.userId = userId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
