import { Min, IsInt, IsPositive, IsOptional } from 'class-validator';

export class CreateBidDto {
  @IsInt()
  @Min(0)
  sellOfferId: number;
  @IsPositive()
  bidAmount: number;
}

export class UpdateBidDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  sellOfferId?: number;
  @IsPositive()
  @IsOptional()
  bidAmount?: number;
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
