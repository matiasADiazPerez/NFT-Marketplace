import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { NftsService } from './nfts.service';
import { CreateTokenDto } from 'models/token.entity';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}
  /** `POST /nfts` By default create a mock nft calling the MockERC721 contract.
   * If the `amount` property is present in the request body, it will create a ERC20 mock token instead
   */
  @Post()
  create(@Req() req: any, @Body() createTokenDto: CreateTokenDto) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.nftsService.create(req.user.userId, createTokenDto.amount);
  }
  /* `GET /nfts` returns the list of nft ids (token id in the contract) in the MockERC721 contract owned by the user**/
  @Get()
  findAllNft(@Req() req: any) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.nftsService.findAllNft(req.user.userId);
  }

  /* `GET /nfts/tokens` returns the amount of tokens defined in MockERC20 contract owned by the user**/
  @Get('tokens')
  findAllToken(@Req() req: any) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.nftsService.findAllToken(req.user.userId);
  }
}
