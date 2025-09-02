import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';

@Module({
  controllers: [ParentsController],
  providers: [ParentsService],
  imports: [TypeOrmModule.forFeature([Parent])],
  exports: [ParentsService],
})
export class ParentsModule {}
