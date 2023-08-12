import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'models/users.entity';
import { Client } from 'src/shared/clients/clients.service';
import { Db } from 'src/shared/db/db.service';
import { NftsService } from '../nfts.service';
import { InvalidId } from 'src/common/tools/errors';
import { BigNumber } from 'ethers';

const SUCCESS = 'success';
const FAIL = 'fail';
const testUser = new User({
  password: 'testPass',
  entropy: 'test entropy',
});

jest.mock('src/shared/clients/clients.service');

describe('NftsService', () => {
  let service: NftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: NftsService,
          useFactory: () => {
            const db = new Db();
            db.users.push(testUser);
            const client = new Client();
            const nftService = new NftsService(client, db);
            return nftService;
          },
        },
      ],
    }).compile();

    service = module.get<NftsService>(NftsService);
  });

  describe('Create nfts and tokens', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
    it('should create a nft', async () => {
      const mockMint = jest
        .spyOn(Client.prototype, 'mint')
        .mockResolvedValue(SUCCESS);
      const res = await service.create(0);
      expect.assertions(2);
      expect(mockMint).toBeCalledWith(
        testUser.userKey,
        testUser.userAddr,
        undefined,
      );
      expect(res).toBe(SUCCESS);
    });
    it('should create tokens', async () => {
      const mockMint = jest
        .spyOn(Client.prototype, 'mint')
        .mockResolvedValue(SUCCESS);
      const res = await service.create(0, '10');
      expect.assertions(2);
      expect(mockMint).toBeCalledWith(
        testUser.userKey,
        testUser.userAddr,
        '10',
      );
      expect(res).toBe(SUCCESS);
    });
    it('should gracefully fail if the db fails', async () => {
      const invalidId = 1;
      const invalid = new InvalidId();
      const expectedError = new HttpException(
        invalid.message,
        HttpStatus.BAD_REQUEST,
      );
      expect.assertions(1);
      try {
        await service.create(invalidId);
      } catch (err) {
        expect(err).toMatchObject(expectedError);
      }
    });
    it('should gracefully fail if the client fails', async () => {
      jest.spyOn(Client.prototype, 'mint').mockImplementation(() => {
        throw new Error(FAIL);
      });
      const expectedError = new HttpException(
        FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect.assertions(1);
      try {
        await service.create(0);
      } catch (err) {
        expect(err).toMatchObject(expectedError);
      }
    });
  });

  describe('find all nft of user', () => {
    it('should return all the nfts of user', async () => {
      const mockgetNfts = jest
        .spyOn(Client.prototype, 'getNfts')
        .mockResolvedValue(BigNumber.from(1));
      const res = await service.findAllNft(0);
      expect.assertions(2);
      expect(mockgetNfts).toBeCalledWith(testUser.userAddr);
      expect(res).toMatchObject(BigNumber.from(1));
    });
    it('should gracefully fail if the db fails', async () => {
      const invalidId = 1;
      const invalid = new InvalidId();
      const expectedError = new HttpException(
        invalid.message,
        HttpStatus.BAD_REQUEST,
      );
      expect.assertions(1);
      try {
        await service.findAllNft(invalidId);
      } catch (err) {
        expect(err).toMatchObject(expectedError);
      }
    });
    it('should gracefully fail if the client fails', async () => {
      jest.spyOn(Client.prototype, 'getNfts').mockImplementation(() => {
        throw new Error(FAIL);
      });
      const expectedError = new HttpException(
        FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect.assertions(1);
      try {
        await service.findAllNft(0);
      } catch (err) {
        expect(err).toMatchObject(expectedError);
      }
    });
  });
  describe('find all tokens of user', () => {
    it('should return all the tokens of user', async () => {
      const mockgetTokens = jest
        .spyOn(Client.prototype, 'getTokens')
        .mockResolvedValue(BigNumber.from(10));
      const res = await service.findAllToken(0);
      expect.assertions(2);
      expect(mockgetTokens).toBeCalledWith(testUser.userAddr);
      expect(res).toMatchObject(BigNumber.from(10));
    });
    it('should gracefully fail if the db fails', async () => {
      const invalidId = 1;
      const invalid = new InvalidId();
      const expectedError = new HttpException(
        invalid.message,
        HttpStatus.BAD_REQUEST,
      );
      expect.assertions(1);
      try {
        await service.findAllToken(invalidId);
      } catch (err) {
        expect(err).toMatchObject(expectedError);
      }
    });
    it('should gracefully fail if the client fails', async () => {
      jest.spyOn(Client.prototype, 'getTokens').mockImplementation(() => {
        throw new Error(FAIL);
      });
      const expectedError = new HttpException(
        FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect.assertions(1);
      try {
        await service.findAllToken(0);
      } catch (err) {
        expect(err).toMatchObject(expectedError);
      }
    });
  });
});
