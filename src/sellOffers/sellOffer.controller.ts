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
import { SellOffersService } from './sellOffer.service';
import { UpdateSellOfferDto } from './dto/update-sellOffer.dto';
import { CloseDto, CreateSellOfferDto } from 'models/sellOffer.entity';

@Controller('sellOffers')
export class SellOffersController {
  constructor(private readonly sellOffersService: SellOffersService) {}

  @Post()
  create(@Req() req: any, @Body() createSellOfferDto: CreateSellOfferDto) {
    try {
      return this.sellOffersService.create(req.user.userId, createSellOfferDto);
    } catch (err) {
      throw err;
    }
  }

  @Get()
  findAll() {
    return this.sellOffersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellOffersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSellOfferDto: UpdateSellOfferDto,
  ) {
    return this.sellOffersService.update(+id, updateSellOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellOffersService.remove(+id);
  }
  @Post('close')
  close(@Req() req: any, @Body() closeDto: CloseDto) {
    try {
      const user = parseInt(req.user.userId);
      return this.sellOffersService.close(user, closeDto.sellOfferId);
    } catch (err) {
      throw err;
    }
  }
  @Post('cancel')
  cancel(@Req() req: any, @Body() closeDto: CloseDto) {
    try {
      const user = parseInt(req.user.userId);
      return this.sellOffersService.cancel(user, closeDto.sellOfferId);
    } catch (err) {
      throw err;
    }
  }
}
