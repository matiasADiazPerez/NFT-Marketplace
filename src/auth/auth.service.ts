import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAuth } from 'models/users.entity';
import { Db } from 'src/shared/db/db.service';
import * as sha256 from 'crypto-js/sha256';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private db: Db, private jwt: JwtService) {}

  async login(userAuth: UserAuth) {
    const user = this.db.getUser(userAuth.userId);
    if (sha256(userAuth.password).toString() !== user?.password) {
      throw new HttpException('Failed login', HttpStatus.UNAUTHORIZED);
    }
    const jwtPayload = { userId: userAuth.userId };
    return {
      accessToken: await this.jwt.signAsync(jwtPayload),
    };
  }
}
