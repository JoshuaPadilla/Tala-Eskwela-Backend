import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceGateway } from './gateways/attendance-gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './users/teachers/teachers.module';
import { StudentsModule } from './users/students/students.module';
import { ParentsModule } from './users/parents/parents.module';
import { Teacher } from './users/teachers/entities/teacher.entity';
import { Student } from './users/students/entities/student.entity';
import { Parent } from './users/parents/entities/parent.entity';
import { RfidModule } from './rfid/rfid.module';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('EXTERNAL_DB_URL'),
        ssl: {
          rejectUnauthorized: true,
        },
        entities: [Teacher, Student, Parent, Course],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TeachersModule,
    StudentsModule,
    ParentsModule,
    RfidModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AttendanceGateway],
})
export class AppModule {}
