import { PartialType } from '@nestjs/mapped-types';
import { CreateBidDto } from 'models/bids.entity';
export class UpdateBidDto extends PartialType(CreateBidDto) {}
