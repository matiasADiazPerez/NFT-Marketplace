import { Min, IsInt, IsPositive, IsOptional } from 'class-validator';

/** The bid creation  object, used as the body of the bid creation request */
export class CreateBidDto {
  @IsInt()
  @Min(0)
  /** The id of the sell offer associated to the bid */
  sellOfferId: number;
  @IsPositive()
  /** The amount of tokens to bid, is a number > 0 */
  bidAmount: number;
}
/** The Bid entity, used to bid on a auction offer or to buy a sale offer  */
export class Bid extends CreateBidDto {
  /** the id of the bid issuer */
  userId: number;
  /** the creation date */
  createdAt: Date;
  /** the date of last update */
  updatedAt: Date;
  /** the date of deletion. If not undefined the bid entity is considered soft deleted */
  DeletedAt?: Date;

  constructor(values: CreateBidDto, userId: number) {
    super();
    Object.assign(this, values);
    this.userId = userId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
