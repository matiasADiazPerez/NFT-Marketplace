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
import { CreateBidDto } from 'models/bids.entity';
import { BidsService } from './bids.service';
import { UpdateBidDto } from './dto/update-bid.dto';
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  create(@Body() createBidDto: CreateBidDto, @Req() req: any) {
    try {
      return this.bidsService.create(createBidDto, req.user.userId);
    } catch (err) {
      throw err;
    }
  }

  @Get()
  findAll() {
    return this.bidsService.findAll();
  }

  @Get('me')
  findByUser(@Req() req: any) {
    return this.bidsService.findAll(req.user.userId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.bidsService.findOne(+id);
    } catch (err) {
      throw err;
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBidDto: UpdateBidDto,
    @Req() req: any,
  ) {
    return this.bidsService.update(+id, req.user.userId, updateBidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.bidsService.remove(req.user.userId, +id);
  }
}
