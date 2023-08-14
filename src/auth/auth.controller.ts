import { Body, Controller, Post } from '@nestjs/common';
import { UserAuth } from 'models/users.entity';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post()
  /** `POST /auth` logs in a user, returns a JWT */
  login(@Body() userAuth: UserAuth) {
    try {
      return this.authService.login(userAuth);
    } catch (err) {
      throw err;
    }
  }
}
