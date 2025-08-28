import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login() {
    this.authService.login();
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registrationDto: RegistrationDto) {
    await this.authService.register(registrationDto);
  }
}
