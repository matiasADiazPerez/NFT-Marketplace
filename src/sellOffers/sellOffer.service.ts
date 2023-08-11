import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateSellOfferDto } from './dto/update-sellOffer.dto';
import {
  SellOffer,
  CreateSellOfferDto,
  AuctionState,
} from 'models/sellOffer.entity';
import { Db } from 'src/shared/db/db.service';
import { Client } from 'src/shared/clients/clients.service';
import { finishAuction } from 'src/common/tools/tools';
import { HandleErr } from 'src/common/tools/errors';

@Injectable()
export class SellOffersService {
  constructor(private client: Client, private db: Db) {}
  async create(
    userId: number,
    createSellOfferDto: CreateSellOfferDto,
  ): Promise<number> {
    try {
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
      return this.db.lastSellIndex();
    } catch (err) {
      HandleErr(err);
    }
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
    if (offer.auctionState !== AuctionState.OnAuction) {
      throw new HttpException(
        'The offer can not be closed now',
        HttpStatus.FORBIDDEN,
      );
    }
    if (offer.userId !== userId) {
      throw new HttpException(
        'You are not allowed to do this action',
        HttpStatus.FORBIDDEN,
      );
    }
    const seller = this.db.getUser(userId);
    const bidder = this.db.getUser(offer.highestBidder);
    const res = await finishAuction(seller, bidder, offer, this.client);
    return res;
  }

  async cancel(userId: number, offerId: number) {
    const offer = this.db.getSellOffer(offerId);
    if (offer.auctionState !== AuctionState.OnAuction) {
      throw new HttpException(
        'The offer can not be closed now',
        HttpStatus.FORBIDDEN,
      );
    }
    if (offer.userId !== userId) {
      throw new HttpException(
        'You are not allowed to do this action',
        HttpStatus.FORBIDDEN,
      );
    }
    offer.auctionState = AuctionState.Closed;
    return 'success';
  }
}
