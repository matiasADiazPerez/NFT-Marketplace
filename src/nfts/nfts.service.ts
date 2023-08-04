import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateNftDto } from './dto/update-nft.dto';
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
      return err;
    }
  }

  findAll(userId: number) {
    const usr = this.db.getUser(userId);
    if (!usr) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const res = this.client.getNfts(usr.userAddr);
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} nft`;
  }

  update(id: number, updateNftDto: UpdateNftDto) {
    return `This action updates a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }
}
