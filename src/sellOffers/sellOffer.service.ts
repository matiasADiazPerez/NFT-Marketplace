import { Injectable } from '@nestjs/common';
import { UpdateSellOfferDto } from './dto/update-sellOffer.dto';
import { SellOffer, CreateSellOfferDto } from 'models/sellOffer.entity';

class SellOfferDb {
  sellOffers: SellOffer[];
  constructor() {
    this.sellOffers = [];
  }
  lastIndex() {
    if (this.sellOffers.length === 0) {
      return 0;
    }
    return this.sellOffers.length - 1;
  }
  getSellOffer(id: number): SellOffer {
    if (id > this.lastIndex()) {
      throw new Error('Invalid id');
    }
    const sellOffer = this.sellOffers[id];
    if (sellOffer.DeletedAt !== null) {
      throw new Error('The sellOffer is deleted');
    }
    return sellOffer;
  }
}

@Injectable()
export class SellOffersService {
  db: SellOfferDb;
  constructor() {
    this.db = new SellOfferDb();
  }
  create(createSellOfferDto: CreateSellOfferDto): number {
    const newSellOffer: SellOffer = new SellOffer(createSellOfferDto);
    this.db.sellOffers.push(newSellOffer);
    return this.db.lastIndex();
  }

  findAll() {
    return this.db.sellOffers.filter((sellOffer) => {
      return sellOffer.DeletedAt !== null;
    });
  }

  findByUserId(userId: string) {
    return this.db.sellOffers.filter((sellOffer) => {
      return sellOffer.userId === userId;
    });
  }

  findOne(id: number) {
    try {
      return this.db.getSellOffer(id);
    } catch (err) {
      throw err;
    }
  }

  update(id: number, updateSellOfferDto: UpdateSellOfferDto) {
    try {
      const sellOffer = this.db.getSellOffer(id);
      const newSellOffer = Object.assign(sellOffer, updateSellOfferDto);
      return newSellOffer;
    } catch (err) {
      throw err;
    }
  }

  remove(id: number) {
    try {
      const sellOffer = this.db.getSellOffer(id);
      sellOffer.DeletedAt = new Date();
      return sellOffer;
    } catch (err) {
      throw err;
    }
  }
}
