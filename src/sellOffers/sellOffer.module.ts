import { Module } from '@nestjs/common';
import { SellOffersService } from './sellOffer.service';
import { SellOffersController } from './sellOffer.controller';

@Module({
  controllers: [SellOffersController],
  providers: [SellOffersService],
})
export class SellOffersModule {}
