import { Global, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Global()
@Module({
  exports: [ClientsService],
  providers: [ClientsService],
})
export class ClientsModule {}
