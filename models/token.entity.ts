import { IsOptional, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsOptional()
  amount?: string;
}
