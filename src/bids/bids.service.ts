import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bid, CreateBidDto, UpdateBidDto } from 'models/bids.entity';
import { Db } from 'src/shared/db/db.service';
import { Client } from 'src/shared/clients/clients.service';
import { AuctionState } from 'models/sellOffer.entity';
import { finishAuction } from 'src/common/tools/tools';
import { HandleErr } from 'src/common/tools/errors';

@Injectable()
export class BidsService {
  constructor(private db: Db, private client: Client) {}

  async create(createBidDto: CreateBidDto, userId: number) {
    try {
      const offer = this.db.getSellOffer(createBidDto.sellOfferId);
      if (!offer) {
        throw new HttpException('Offer does not exist', HttpStatus.NOT_FOUND);
      }
      switch (offer.auctionState) {
        case AuctionState.Closed:
          throw new HttpException(
            'Offer does not accept more bids',
            HttpStatus.BAD_REQUEST,
          );
        case AuctionState.OnSale:
          const bidder = this.db.getUser(userId);
          if (!bidder) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          }
          const seller = this.db.getUser(offer.userId);
          await finishAuction(seller, bidder, offer, this.client);
          break;
        case AuctionState.OnAuction:
          if (createBidDto.bidAmount < offer.currentBid) {
            throw new HttpException(
              'bid amount is less than the current high',
              HttpStatus.BAD_REQUEST,
            );
          }
          offer.currentBid = createBidDto.bidAmount;
          offer.highestBidder = userId;
          break;
        default:
          throw new HttpException(
            'The offer is in an unknown state',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
      const newBid: Bid = new Bid(createBidDto, userId);
      this.db.bids.push(newBid);
      return this.db.lastBidIndex();
    } catch (err) {
      HandleErr(err);
    }
  }

  findAll(user?: number) {
    return this.db.bids.filter((bid) => {
      if (user) {
        return bid.DeletedAt !== null && bid.userId == user;
      }
      return bid.DeletedAt !== null;
    });
  }

  findOne(id: number) {
    try {
      return this.db.getBid(id);
    } catch (err) {
      HandleErr(err);
    }
  }

  update(id: number, user: number, updateBidDto: UpdateBidDto) {
    try {
      const bid = this.db.getBid(id);
      if (bid.userId !== user) {
        throw new HttpException(
          'You cannot do this action',
          HttpStatus.FORBIDDEN,
        );
      }
      const newBid = Object.assign(bid, updateBidDto);
      return newBid;
    } catch (err) {
      HandleErr(err);
    }
  }
  remove(user: number, id: number) {
    try {
      const bid = this.db.getBid(id);
      if (bid.userId !== user) {
        throw new HttpException(
          'You cannot do this action',
          HttpStatus.FORBIDDEN,
        );
      }
      bid.DeletedAt = new Date();
      return bid;
    } catch (err) {
      HandleErr(err);
    }
  }
}
