import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { NftsService } from './nfts.service';
import { UpdateNftDto } from './dto/update-nft.dto';
import { CreateTokenDto } from 'models/token.entity';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Post()
  create(@Req() req: any, @Body() createTokenDto: CreateTokenDto) {
    const user = parseInt(req.user.userId);
    return this.nftsService.create(user, createTokenDto.amount);
  }

  @Get()
  findAll(@Req() req: any) {
    const user = parseInt(req.user.userId);
    return this.nftsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nftsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNftDto: UpdateNftDto) {
    return this.nftsService.update(+id, updateNftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nftsService.remove(+id);
  }
}
