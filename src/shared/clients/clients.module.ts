import { Global, Module } from '@nestjs/common';
import { Client } from './clients.service';

@Global()
@Module({
  exports: [Client],
  providers: [Client],
})
export class ClientsModule {}
