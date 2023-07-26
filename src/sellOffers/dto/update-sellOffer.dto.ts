import { PartialType } from '@nestjs/mapped-types';

import { CreateSellOfferDto } from 'models/sellOffer.entity';
export class UpdateSellOfferDto extends PartialType(CreateSellOfferDto) {}
