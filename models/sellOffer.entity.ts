export class CreateSellOfferDto {
  userId: string;
  nftContractAddr: string;
  erc20ContractAddr: string;
  erc20Symbol: string;
  price?: number;
  isAuction?: boolean;
  minOffer?: number;
}

export class SellOffer extends CreateSellOfferDto {
  createdAt: Date;
  updatedAt: Date;
  DeletedAt?: Date;

  constructor(values: CreateSellOfferDto) {
    super();
    Object.assign(this, values);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
