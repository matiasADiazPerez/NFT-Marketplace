import { Injectable } from '@nestjs/common';
import { CreateUserDto, User } from 'models/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db } from 'src/shared/db/db.service';
import { ethers } from 'ethers';
import * as sha256 from 'crypto-js/sha256';

@Injectable()
export class UserService {
  constructor(private db: Db) {}
  create(createUserDto: CreateUserDto): number {
    if (!createUserDto.userKey) {
      const wallet = ethers.Wallet.createRandom();
      createUserDto.userKey = wallet.privateKey;
    }
    console.log(createUserDto);
    const newUser: User = new User(createUserDto);
    newUser.password = sha256(createUserDto.password).toString();
    this.db.users.push(newUser);
    console.log(process.env.JWT_SECRET);
    return this.db.lastUserIndex();
  }

  findAll() {
    return this.db.users.filter((user) => {
      return user.DeletedAt !== null;
    });
  }

  findOne(id: number) {
    try {
      return this.db.getUser(id);
    } catch (err) {
      throw err;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    try {
      const sellOffer = this.db.getSellOffer(id);
      sellOffer.DeletedAt = new Date();
      return sellOffer;
    } catch (err) {
      throw err;
    }
  }
}
