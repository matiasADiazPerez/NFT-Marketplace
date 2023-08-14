import { Injectable } from '@nestjs/common';
import { HandleErr } from 'src/common/errors';
import { Client } from 'src/shared/clients/clients.service';
import { Db } from 'src/shared/db/db.service';

@Injectable()
export class NftsService {
  constructor(private client: Client, private db: Db) {}
  /**  Creates a nft by default (MockERC721).
   *  If amount is present, its create a token (MockERC20)
   */
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
  /** returns the ids of the nft (MockERC721) owned by the user */
  async findAllNft(userId: number) {
    try {
      const usr = this.db.getUser(userId);
      const res = await this.client.getNfts(usr.userAddr);
      return res;
    } catch (err) {
      HandleErr(err);
    }
  }

  /** returns the ids of tokens (MockERC20) owned by the user */
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
