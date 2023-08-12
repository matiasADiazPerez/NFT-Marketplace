import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  SellOffer,
  CreateSellOfferDto,
  AuctionState,
  UpdatePrice,
} from 'models/sellOffer.entity';
import { Db } from 'src/shared/db/db.service';
import { Client } from 'src/shared/clients/clients.service';
import { finishAuction } from 'src/common/tools/tools';
import { HandleErr, NotOwner } from 'src/common/tools/errors';

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
        throw new NotOwner('nft');
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
      return !sellOffer.DeletedAt;
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
      HandleErr(err);
    }
  }

  updatePrice(userId: number, id: number, updateSellOfferDto: UpdatePrice) {
    try {
      const sellOffer = this.db.getSellOffer(id);
      if (sellOffer.userId !== userId) {
        throw new NotOwner('sell offer');
      }
      if (sellOffer.auctionState !== AuctionState.OnSale) {
        throw new HttpException(
          'The offer can not be updated',
          HttpStatus.CONFLICT,
        );
      }
      sellOffer.price = updateSellOfferDto.price;
      return sellOffer;
    } catch (err) {
      HandleErr(err);
    }
  }

  remove(userId: number, id: number) {
    try {
      const sellOffer = this.db.getSellOffer(id);
      if (sellOffer.userId !== userId) {
        throw new NotOwner('sell offer');
      }
      sellOffer.DeletedAt = new Date();
      return sellOffer;
    } catch (err) {
      HandleErr(err);
    }
  }
  async close(userId: number, offerId: number) {
    try {
      const offer = this.db.getSellOffer(offerId);
      if (offer.auctionState !== AuctionState.OnAuction) {
        throw new HttpException(
          'The offer can not be closed now',
          HttpStatus.CONFLICT,
        );
      }
      if (offer.userId !== userId) {
        throw new NotOwner('sell offer');
      }
      const seller = this.db.getUser(userId);
      const bidder = this.db.getUser(offer.highestBidder);
      const res = await finishAuction(seller, bidder, offer, this.client);
      return res;
    } catch (err) {
      HandleErr(err);
    }
  }

  cancel(userId: number, offerId: number) {
    try {
      const offer = this.db.getSellOffer(offerId);
      if (offer.userId !== userId) {
        throw new NotOwner('sell offer');
      }
      offer.auctionState = AuctionState.Closed;
      return 'success';
    } catch (err) {
      HandleErr(err);
    }
  }
}
