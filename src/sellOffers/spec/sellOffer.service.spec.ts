import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SellOffersService } from '../sellOffer.service';
import { Db } from 'src/shared/db/db.service';
import { Client } from 'src/shared/clients/clients.service';
import { User } from 'models/users.entity';
import { DeletedEntity, InvalidId, NotOwner } from 'src/common/tools/errors';
import { AuctionState, SellOffer } from 'models/sellOffer.entity';
import * as toSpyModule from 'src/common/tools/tools';

enum SellOfferId {
  auction,
  deleted,
  onSale,
  toClose,
  toCancel,
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

const testSellOffer = new SellOffer({ tokenId: 0 }, 0);

const deletedTestSellOffer = new SellOffer({ tokenId: 0 }, 0);
deletedTestSellOffer.DeletedAt = new Date();

const onSaleOffer = new SellOffer({ tokenId: 0, price: 100 }, 0);

const toCloseOffer = new SellOffer({ tokenId: 0 }, 0);
toCloseOffer.highestBidder = UsersIds.bidder;

const toCancel = new SellOffer({ tokenId: 10 }, 0);

const client = new Client();
jest.mock('src/shared/clients/clients.service');
jest.mock('src/common/tools/tools');
describe('SellOffersService', () => {
  let service: SellOffersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SellOffersService,
          useFactory: () => {
            const db = new Db();
            db.users.push(testUser);
            db.users.push(testBidder);
            db.sellOffers.push(testSellOffer);
            db.sellOffers.push(deletedTestSellOffer);
            db.sellOffers.push(onSaleOffer);
            db.sellOffers.push(toCloseOffer);
            const nftService = new SellOffersService(client, db);
            return nftService;
          },
        },
      ],
    }).compile();

    service = module.get<SellOffersService>(SellOffersService);
  });
  describe('Create a sell offer', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
    it('should create a sell offer', async () => {
      const mockOwnerOf = jest
        .spyOn(Client.prototype, 'ownerOf')
        .mockResolvedValue(testUser.userAddr);
      const res = await service.create(0, { tokenId: 0 });
      expect.assertions(2);
      expect(mockOwnerOf).toBeCalledWith('0');
      expect(res).toBe(4);
    });
    it('should fail if the user does not owns the nft', async () => {
      jest
        .spyOn(Client.prototype, 'ownerOf')
        .mockResolvedValue('wrong address');

      const expectedErr = new HttpException(
        'You are not the owner of the nft',
        HttpStatus.FORBIDDEN,
      );
      try {
        expect.assertions(1);
        await service.create(0, { tokenId: 0 });
      } catch (err) {
        expect(err).toMatchObject(expectedErr);
      }
    });
    it('should gracefully fail if the db fails', async () => {
      jest
        .spyOn(Client.prototype, 'ownerOf')
        .mockResolvedValue(testUser.userAddr);
      const invalid = new InvalidId();
      const expectedErr = new HttpException(
        invalid.message,
        HttpStatus.BAD_REQUEST,
      );
      try {
        expect.assertions(1);
        await service.create(2, { tokenId: 0 });
      } catch (err) {
        expect(err).toMatchObject(expectedErr);
      }
    });
  });
  describe('find all sell offers', () => {
    it('should return all sell offers', () => {
      const res = service.findAll();
      expect(res).toMatchObject([testSellOffer, onSaleOffer, toCloseOffer]);
    });
  });
  describe('find offers owned by user', () => {
    it('should return all sell offers of the user', () => {
      const res = service.findByUserId(0);
      expect(res).toMatchObject([
        testSellOffer,
        deletedTestSellOffer,
        onSaleOffer,
        toCloseOffer,
      ]);
    });
  });
  describe('find one sell offers', () => {
    it('should return the corresponding sell offer', () => {
      const res = service.findOne(SellOfferId.auction);
      expect(res).toMatchObject(testSellOffer);
    });
  });
  describe('update price of offer', () => {
    it('should update the price of corresponding sell offer', () => {
      const res = service.updatePrice(0, SellOfferId.onSale, { price: 110 });
      expect(res.price).toBe(110);
    });
    it('should fail if sell offer is deleted', () => {
      try {
        expect.assertions(1);
        service.updatePrice(0, SellOfferId.deleted, { price: 110 });
      } catch (err) {
        const deletedErr = new DeletedEntity('sellOffer');
        const expectedErr = new HttpException(
          deletedErr.message,
          HttpStatus.BAD_REQUEST,
        );
        expect(err).toMatchObject(expectedErr);
      }
    });

    it('should fail if user is not onwer of sell offer', () => {
      try {
        expect.assertions(1);
        service.updatePrice(1, SellOfferId.onSale, { price: 110 });
      } catch (err) {
        expect(err instanceof NotOwner).toBeTruthy();
      }
    });
    it('should fail if the sell offer is not on sale', () => {
      try {
        expect.assertions(1);
        service.updatePrice(0, SellOfferId.auction, { price: 110 });
      } catch (err) {
        const expectedErr = new HttpException(
          'The offer can not be updated',
          HttpStatus.CONFLICT,
        );
        expect(err).toMatchObject(expectedErr);
      }
    });
  });
  describe('remove sell offer', () => {
    it('should remove a sell offer', () => {
      service.remove(0, SellOfferId.auction);
      const sellOffers = service.findAll();
      expect(sellOffers).toMatchObject([onSaleOffer, toCloseOffer]);
    });
    it('should fail if user is not onwer of sell offer', () => {
      try {
        expect.assertions(1);
        service.remove(1, SellOfferId.onSale);
      } catch (err) {
        expect(err instanceof NotOwner).toBeTruthy();
      }
    });
    it('should gracefully fail if the db fails', async () => {
      const invalid = new InvalidId();
      const expectedErr = new HttpException(
        invalid.message,
        HttpStatus.BAD_REQUEST,
      );
      try {
        expect.assertions(1);
        service.remove(0, 6);
      } catch (err) {
        expect(err).toMatchObject(expectedErr);
      }
    });
  });
  describe('close an auction', () => {
    it('should close an auction', async () => {
      const mockFinisAuction = jest
        .spyOn(toSpyModule, 'finishAuction')
        .mockResolvedValue();
      await service.close(0, SellOfferId.toClose);
      expect(mockFinisAuction).toBeCalledWith(
        testUser,
        testBidder,
        toCloseOffer,
        client,
      );
      expect(toCloseOffer.auctionState).toBe(AuctionState.Closed);
    });
    it('should fail if user is not onwer of sell offer', async () => {
      try {
        expect.assertions(1);
        await service.close(1, SellOfferId.toClose);
      } catch (err) {
        expect(err instanceof NotOwner).toBeTruthy();
      }
    });
    it('should fail if is not auction', async () => {
      try {
        expect.assertions(1);
        await service.close(0, SellOfferId.onSale);
      } catch (err) {
        const expectedErr = new HttpException(
          'The offer can not be closed now',
          HttpStatus.CONFLICT,
        );
        expect(err).toMatchObject(expectedErr);
      }
    });
    it('should gracefully fail if the db fails', async () => {
      try {
        expect.assertions(1);
        await service.close(0, 5);
      } catch (err) {
        const invalid = new InvalidId();
        const expectedErr = new HttpException(
          invalid.message,
          HttpStatus.BAD_REQUEST,
        );
        expect(err).toMatchObject(expectedErr);
      }
    });
  });
  describe('cancel a sell offer', () => {
    it('Should cancel a sellOffer', () => {
      service.cancel(0, SellOfferId.toClose);
      expect(toCloseOffer.auctionState).toBe(AuctionState.Closed);
    });
    it('should fail if user is not onwer of sell offer', () => {
      try {
        expect.assertions(1);
        service.cancel(1, SellOfferId.toCancel);
      } catch (err) {
        expect(err instanceof NotOwner).toBeTruthy();
      }
    });
    it('should gracefully fail if the db fails', () => {
      try {
        expect.assertions(1);
        service.cancel(0, 5);
      } catch (err) {
        const invalid = new InvalidId();
        const expectedErr = new HttpException(
          invalid.message,
          HttpStatus.BAD_REQUEST,
        );
        expect(err).toMatchObject(expectedErr);
      }
    });
  });
});
