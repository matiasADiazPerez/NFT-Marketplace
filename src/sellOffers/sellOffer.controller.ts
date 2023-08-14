import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SellOffersService } from './sellOffer.service';
import {
  CloseDto,
  CreateSellOfferDto,
  UpdatePrice,
} from 'models/sellOffer.entity';

@Controller('sellOffers')
export class SellOffersController {
  constructor(private readonly sellOffersService: SellOffersService) {}
  /** `POST /sellOffers` creates an auction or a sale offer.
   * If it is a sale offer, the price must be present.
   * */
  @Post()
  create(@Req() req: any, @Body() createSellOfferDto: CreateSellOfferDto) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.sellOffersService.create(req.user.userId, createSellOfferDto);
  }
  /** `GET /sellOffers` fetch all non deleted sell offers */
  @Get()
  findAll() {
    return this.sellOffersService.findAll();
  }
  /** `GET /sellOffers` fetch a single sellOffer */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellOffersService.findOne(+id);
  }
  /** `PATCH /sellOffers` change the price of a sell offer.
   *  Fails if is an auction or the offer is closed
   */
  @Patch('price/:id')
  updatePrice(
    @Param('id') id: string,
    @Body() updateSellOfferDto: UpdatePrice,
    @Req() req: any,
  ) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.sellOffersService.updatePrice(
      req.user.userId,
      +id,
      updateSellOfferDto,
    );
  }
  /** `DELETE /sellOffers` Removes a non closed sellOffer */
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.sellOffersService.remove(req.user.userId, +id);
  }
  /** `POST /sellOffers/close` Closes an auction.
   * The highest bidder adjudicates the nft at the current bid amount
   */
  @Post('close')
  close(@Req() req: any, @Body() closeDto: CloseDto) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.sellOffersService.close(req.user.userId, closeDto.sellOfferId);
  }
  /** `POST /cancel` Cancels a non closed sellOffer */
  @Post('cancel')
  cancel(@Req() req: any, @Body() closeDto: CloseDto) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.sellOffersService.cancel(req.user.userId, closeDto.sellOfferId);
  }
}
