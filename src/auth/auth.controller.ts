import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    console.log('controller', req.user);
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registrationDto: RegistrationDto): Promise<any> {
    const result = await this.authService.register(registrationDto);

    return {
      message: `Registered Successfully`,
      data: result,
    };
  }
}
