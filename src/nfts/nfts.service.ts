import { Injectable } from '@nestjs/common';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { ClientsService } from 'src/shared/clients/clients.service';

@Injectable()
export class NftsService {
  constructor(private client: ClientsService) {}
  async create(createNftDto: CreateNftDto) {
    try {
      const response = await this.client.mint();
      return response;
    } catch (err) {
      return err;
    }
  }

  findAll() {
    return `This action returns all nfts`;
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
