import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { CreateTokenDto } from 'models/token.entity';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Post()
  create(@Req() req: any, @Body() createTokenDto: CreateTokenDto) {
    return this.nftsService.create(req.user.userId, createTokenDto.amount);
  }

  @Get()
  findAllNft(@Req() req: any) {
    return this.nftsService.findAllNft(req.user.userId);
  }

  @Get('tokens')
  findAllToken(@Req() req: any) {
    console.log(req.user);
    return this.nftsService.findAllToken(req.user.userId);
  }
}
