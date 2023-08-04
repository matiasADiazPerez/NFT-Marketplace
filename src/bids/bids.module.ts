import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { DbModule } from 'src/shared/db/db.module';
import { ClientsModule } from 'src/shared/clients/clients.module';

@Module({
  imports: [DbModule, ClientsModule],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
