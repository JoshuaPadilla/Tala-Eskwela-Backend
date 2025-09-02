import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ParentsService } from 'src/endpoints/users/parents/parents.service';
import { StudentsService } from 'src/endpoints/users/students/students.service';
import { TeachersService } from 'src/endpoints/users/teachers/teachers.service';
import { TeachersModule } from 'src/endpoints/users/teachers/teachers.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { ParentsModule } from 'src/endpoints/users/parents/parents.module';
import { StudentsModule } from 'src/endpoints/users/students/students.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    TeachersModule,
    StudentsModule,
    ParentsModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET', 'Hello world'),
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
  ],
})
export class AuthModule {}
