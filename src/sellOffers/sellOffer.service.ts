import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateSellOfferDto } from './dto/update-sellOffer.dto';
import {
  SellOffer,
  CreateSellOfferDto,
  AuctionState,
} from 'models/sellOffer.entity';
import { Db } from 'src/shared/db/db.service';
import { Client } from 'src/shared/clients/clients.service';

@Injectable()
export class SellOffersService {
  constructor(private client: Client, private db: Db) {}
  async create(
    userId: number,
    createSellOfferDto: CreateSellOfferDto,
  ): Promise<number> {
    const ownerOfToken = await this.client.ownerOf(
      createSellOfferDto.tokenId.toString(),
    );
    const user = this.db.getUser(userId);
    if (ownerOfToken !== user.userAddr) {
      throw new HttpException(
        'You are not the owner of the nft',
        HttpStatus.FORBIDDEN,
      );
    }
    const newSellOffer: SellOffer = new SellOffer(createSellOfferDto, userId);
    this.db.sellOffers.push(newSellOffer);
    console.log(this.db);
    return this.db.lastSellIndex();
  }

  findAll() {
    return this.db.sellOffers.filter((sellOffer) => {
      return sellOffer.DeletedAt !== null;
    });
  }

  findByUserId(userId: number) {
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
  async close(userId: number, offerId: number) {
    const offer = this.db.getSellOffer(offerId);
    if (offer.auctionState !== AuctionState.Adjudicated) {
      throw new HttpException(
        'The offer can not be closed now',
        HttpStatus.FORBIDDEN,
      );
    }
    if (offer.highestBidder !== userId) {
      throw new HttpException(
        'You are not the adjudicated bidder',
        HttpStatus.FORBIDDEN,
      );
    }
    const res = await this._buyOffer(userId, offer);
    return res;
  }
}
