import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAuth } from 'models/users.entity';
import { Db } from 'src/shared/db/db.service';
import * as sha256 from 'crypto-js/sha256';
import { JwtService } from '@nestjs/jwt';
import { HandleErr } from 'src/common/errors';

@Injectable()
export class AuthService {
  constructor(private db: Db, private jwt: JwtService) {}
  /** User login, if the user credential are correct, a JWT with the userID is issued */
  async login(userAuth: UserAuth) {
    try {
      const user = this.db.getUser(userAuth.userId);
      if (sha256(userAuth.password).toString() !== user?.password) {
        throw new HttpException('Failed login', HttpStatus.UNAUTHORIZED);
      }
      const jwtPayload = { userId: userAuth.userId };
      return {
        accessToken: await this.jwt.signAsync(jwtPayload),
      };
    } catch (err) {
      HandleErr(err);
    }
  }
}
