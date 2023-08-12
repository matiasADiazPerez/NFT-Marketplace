import { Injectable } from '@nestjs/common';
import { HandleErr } from 'src/common/tools/errors';
import { Client } from 'src/shared/clients/clients.service';
import { Db } from 'src/shared/db/db.service';

@Injectable()
export class NftsService {
  constructor(private client: Client, private db: Db) {}
  async create(userId: number, amount?: string) {
    try {
      const user = this.db.getUser(userId);
      const response = await this.client.mint(
        user.userKey,
        user.userAddr,
        amount,
      );
      return response;
    } catch (err) {
      HandleErr(err);
    }
  }

  async findAllNft(userId: number) {
    try {
      const usr = this.db.getUser(userId);
      const res = await this.client.getNfts(usr.userAddr);
      return res;
    } catch (err) {
      HandleErr(err);
    }
  }

  async findAllToken(userId: number) {
    try {
      const usr = this.db.getUser(userId);
      const res = await this.client.getTokens(usr.userAddr);
      return res;
    } catch (err) {
      HandleErr(err);
    }
  }
}
