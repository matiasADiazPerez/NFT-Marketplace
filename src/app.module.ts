import { Module } from '@nestjs/common';
import { SellOffersModule } from './sellOffers/sellOffer.module';
import { AuthModule } from './auth/auth.module';
import { NftsModule } from './nfts/nfts.module';
import { ClientsModule } from './shared/clients/clients.module';
import { DbModule } from './shared/db/db.module';
import { BidsModule } from './bids/bids.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    ClientsModule,
    SellOffersModule,
    AuthModule,
    NftsModule,
    BidsModule,
    DbModule,
    ConfigModule.forRoot(),
    UserModule,
    TokensModule,
  ],
})
export class AppModule {}
