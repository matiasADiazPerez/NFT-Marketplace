import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bid, CreateBidDto } from 'models/bids.entity';
import { Db } from 'src/shared/db/db.service';
import { Client } from 'src/shared/clients/clients.service';
import { AuctionState } from 'models/sellOffer.entity';
import { finishAuction } from 'src/common/tools/tools';
import { HandleErr, NotOwner } from 'src/common/errors';

@Injectable()
export class BidsService {
  constructor(private client: Client, private db: Db) {}
  /**
   * the creation bid services.
   * If the sell offer is a sale, it executes the exchange inmediatly.
   * If is an auction, place the bid and update the highest bidder of the offer
   */
  async create(createBidDto: CreateBidDto, userId: number) {
    try {
      const offer = this.db.getSellOffer(createBidDto.sellOfferId);
      switch (offer.auctionState) {
        case AuctionState.Closed:
          throw new HttpException(
            'Offer does not accept more bids',
            HttpStatus.CONFLICT,
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
  /** Finds all non deleted bids.
   * If a user id is provided, returns only the bids owned by that user id
   */
  findAll(user?: number) {
    return this.db.bids.filter((bid) => {
      if (user) {
        return bid.DeletedAt !== null && bid.userId == user;
      }
      return bid.DeletedAt !== null;
    });
  }

  /** Finds the bid with the id provided. */
  findOne(id: number) {
    try {
      return this.db.getBid(id);
    } catch (err) {
      HandleErr(err);
    }
  }
  /** removes a bid only if the sellOffer is an ongoing auction.
   * If the deleted bid was the highest one, the service will restore the highest bidder and current bid of the offer to the previous highest bid.
   * If there are no more bids, it restore the values to default.
   */
  remove(user: number, id: number) {
    try {
      const bid = this.db.getBid(id);
      if (bid.userId !== user) {
        throw new NotOwner('bid');
      }
      bid.DeletedAt = new Date();
      const offer = this.db.getSellOffer(bid.sellOfferId);
      if (offer.currentBid === bid.bidAmount) {
        const lastBid = this.db.bids
          .filter((b) => {
            return bid.sellOfferId === b.sellOfferId && !b.DeletedAt;
          })
          .sort((b1, b2) => b1.bidAmount - b2.bidAmount)[0];
        if (!lastBid) {
          offer.highestBidder = undefined;
          offer.currentBid = offer.minOffer || 0;
        } else {
          offer.highestBidder = lastBid.userId;
          offer.currentBid = lastBid.bidAmount;
        }
      }
      return bid;
    } catch (err) {
      HandleErr(err);
    }
  }
}
