import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ethers } from 'ethers';

export class UserAuth {
  @IsNumber()
  userId: number;
  @IsString()
  password: string;
}

export class CreateUserDto {
  @IsOptional()
  @IsString()
  userKey: string;
  @IsString()
  password: string;
}

export class User extends CreateUserDto {
  userAddr: string;
  createdAt: Date;
  updatedAt: Date;
  DeletedAt?: Date;

  constructor(values: CreateUserDto) {
    super();
    const wallet = new ethers.Wallet(values.userKey);
    this.userAddr = wallet.address;
    Object.assign(this, values);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
