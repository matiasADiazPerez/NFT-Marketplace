import { Min, IsString, IsInt } from 'class-validator';
import { ethers } from 'ethers';
import { utils } from 'web3';

export class UserAuth {
  @IsInt()
  @Min(0)
  userId: number;
  @IsString()
  password: string;
}

export class CreateUserDto {
  @IsString()
  entropy: string;
  @IsString()
  password: string;
}

export class User {
  userKey: string;
  password: string;
  userAddr: string;
  createdAt: Date;
  updatedAt: Date;
  DeletedAt?: Date;

  constructor(values: CreateUserDto) {
    const key = utils.sha3(values.entropy);
    const wallet = new ethers.Wallet(key);
    this.userKey = key;
    this.userAddr = wallet.address;
    Object.assign(this, values);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
