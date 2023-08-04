import { Module } from '@nestjs/common';
import { SellOffersService } from './sellOffer.service';
import { SellOffersController } from './sellOffer.controller';
import { DbModule } from 'src/shared/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [SellOffersController],
  providers: [SellOffersService],
})
export class SellOffersModule {}
