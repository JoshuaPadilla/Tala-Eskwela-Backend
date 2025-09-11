import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guards/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
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

  @UseGuards(JwtAuthGuard)
  @Get('check')
  checkAuth(@Request() req) {
    return this.authService.checkAuth(req.user);
  }
}
