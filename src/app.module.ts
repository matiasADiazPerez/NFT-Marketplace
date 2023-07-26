import { Module } from '@nestjs/common';
import { SellOffersModule } from './sellOffers/sellOffer.module';
import { AuthModule } from './auth/auth.module';
import { NftsModule } from './nfts/nfts.module';
import { ClientsModule } from './shared/clients/clients.module';

@Module({
  imports: [ClientsModule, SellOffersModule, AuthModule, NftsModule],
})
export class AppModule {}
