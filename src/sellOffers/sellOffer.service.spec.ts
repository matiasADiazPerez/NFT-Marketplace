import { Test, TestingModule } from '@nestjs/testing';
import { SellOfferService } from './sellOffer.service';

describe('SellOffersService', () => {
  let service: SellOfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellOfferService],
    }).compile();

    service = module.get<SellOfferService>(SellOfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
