import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateBidDto } from 'models/bids.entity';
import { BidsService } from './bids.service';
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}
  /** `POST /bids` Creates a bid */
  @Post()
  create(@Body() createBidDto: CreateBidDto, @Req() req: any) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.bidsService.create(createBidDto, req.user.userId);
  }

  /** `GET /bids` Fetch all non deleted bids */
  @Get()
  findAll() {
    return this.bidsService.findAll();
  }

  /** `GET /bids/me` Fetch all bids of the user (the JWT issuer) */
  @Get('me')
  findByUser(@Req() req: any) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.bidsService.findAll(req.user.userId);
  }
  /** `GET /bids/:id` Fetch a single bid */
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.bidsService.findOne(+id);
    } catch (err) {
      throw err;
    }
  }
  /** `DELETE /bids/:id` remove a bid of an ongoing auction */
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user?.userId === undefined) {
      throw new HttpException(
        'Cannot find the user id in JWT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.bidsService.remove(req.user.userId, +id);
  }
}
