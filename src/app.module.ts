import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceGateway } from './gateways/attendance-gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './endpoints/users/teachers/teachers.module';
import { StudentsModule } from './endpoints/users/students/students.module';
import { ParentsModule } from './endpoints/users/parents/parents.module';
import { Teacher } from './endpoints/users/teachers/entities/teacher.entity';
import { Student } from './endpoints/users/students/entities/student.entity';
import { Parent } from './endpoints/users/parents/entities/parent.entity';
import { RfidModule } from './endpoints/rfid/rfid.module';
import { ClassModule } from './endpoints/class/class.module';
import { Class } from './endpoints/class/entities/class.entity';
import { NotificationsService } from './notifications/notifications.service';
import { AttendanceModule } from './endpoints/attendance/attendance.module';
import { Schedule } from './endpoints/schedule/entities/schedule.entity';
import { Attendance } from './endpoints/attendance/entities/attendance.entity';
import { Subject } from './endpoints/subject/entities/subject.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { InitializerService } from './init.service';

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
        entities: [
          Teacher,
          Student,
          Parent,
          Class,
          Schedule,
          Attendance,
          Subject,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TeachersModule,
    StudentsModule,
    ParentsModule,
    RfidModule,
    ClassModule,
    AttendanceModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AttendanceGateway,
    NotificationsService,
    InitializerService,
  ],
})
export class AppModule {}
