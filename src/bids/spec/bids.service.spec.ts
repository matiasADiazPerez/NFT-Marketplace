import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Db } from 'src/shared/db/db.service';
import { Client } from 'src/shared/clients/clients.service';
import { User } from 'models/users.entity';
import { AuctionState, SellOffer } from 'models/sellOffer.entity';
import * as toSpyModule from 'src/common/tools/tools';
import { BidsService } from '../bids.service';
import { Bid } from 'models/bids.entity';

enum SellOfferId {
  auction,
  onSale,
}

enum UsersIds {
  seller,
  bidder,
}

const testUser = new User({
  password: 'testPass',
  entropy: 'test entropy',
});

const testBidder = new User({
  password: 'testPass2',
  entropy: 'test entropy2',
});

let testSellOffer: SellOffer;
let onSaleOffer: SellOffer;

let testBid: Bid;
let invalidBid: Bid;

const client = new Client();
jest.mock('src/shared/clients/clients.service');
jest.mock('src/common/tools/tools');
describe('BidsService', () => {
  let service: BidsService;
  beforeEach(async () => {
    testSellOffer = new SellOffer({ tokenId: 0 }, 0);

    onSaleOffer = new SellOffer({ tokenId: 0, price: 100 }, 0);

    testBid = new Bid({ sellOfferId: 0, bidAmount: 5 }, UsersIds.bidder);
    invalidBid = new Bid({ sellOfferId: 5, bidAmount: 5 }, 2);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BidsService,
          useFactory: () => {
            const db = new Db();
            db.users.push(testUser);
            db.users.push(testBidder);
            db.sellOffers.push(testSellOffer);
            db.sellOffers.push(onSaleOffer);
            db.bids.push(testBid);
            db.bids.push(invalidBid);
            const bidService = new BidsService(client, db);
            return bidService;
          },
        },
      ],
    }).compile();

    service = module.get<BidsService>(BidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create a bid', () => {
    it('should create a bid for an auction', async () => {
      const res = await service.create(
        { sellOfferId: SellOfferId.auction, bidAmount: 10 },
        UsersIds.bidder,
      );
      expect(res).toBe(2);
      expect(testSellOffer.highestBidder).toBe(UsersIds.bidder);
    });
    it('should buy an nft', async () => {
      const mockFinisAuction = jest
        .spyOn(toSpyModule, 'finishAuction')
        .mockResolvedValue();
      const res = await service.create(
        { sellOfferId: SellOfferId.onSale, bidAmount: 10 },
        UsersIds.bidder,
      );
      expect(res).toBe(2);
      expect(mockFinisAuction).toBeCalledWith(
        testUser,
        testBidder,
        onSaleOffer,
        client,
      );
    });
    it('should fail if the amount is less than the current bid', async () => {
      expect.assertions(1);
      try {
        testSellOffer.currentBid = 4;
        await service.create(
          { sellOfferId: SellOfferId.auction, bidAmount: 1 },
          UsersIds.bidder,
        );
      } catch (err) {
        const expectedErr = new HttpException(
          'bid amount is less than the current high',
          HttpStatus.BAD_REQUEST,
        );
        expect(err).toMatchObject(expectedErr);
      }
    });
    it('should fail if the auction is closed', async () => {
      expect.assertions(1);
      try {
        testSellOffer.auctionState = AuctionState.Closed;
        await service.create(
          { sellOfferId: SellOfferId.auction, bidAmount: 10 },
          UsersIds.bidder,
        );
      } catch (err) {
        const expectedErr = new HttpException(
          'Offer does not accept more bids',
          HttpStatus.CONFLICT,
        );
        expect(err).toMatchObject(expectedErr);
      }
    });
  });
  describe('Find all bids', () => {
    it('should return all bids', () => {
      const res = service.findAll();
      expect(res).toMatchObject([testBid, invalidBid]);
    });

    it('should return bids of user', () => {
      const res = service.findAll(UsersIds.bidder);
      expect(res).toMatchObject([testBid]);
    });
  });
  describe('find bid by id', () => {
    it('should return a bid', () => {
      const res = service.findOne(0);
      expect(res).toMatchObject(testBid);
    });
  });
  describe('remove a bid', () => {
    it('should remove a bid', () => {
      const res = service.remove(UsersIds.bidder, 0);
      expect(testSellOffer.highestBidder).toBeUndefined();
      expect(testSellOffer.currentBid).toBe(0);
      expect(testBid.DeletedAt).toBeDefined();
      expect(res).toBe(testBid);
    });
  });
});
