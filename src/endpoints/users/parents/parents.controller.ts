import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ParentsService } from './parents.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateParentDto } from './dto/update-parent.dto';

@UseGuards(JwtAuthGuard)
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get()
  async findAll() {
    return await this.parentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.parentsService.findById(id);
  }

  @Patch(':id')
  async updateParent(
    @Param('id') id: string,
    @Body() updateForm: UpdateParentDto,
  ) {
    return await this.parentsService.updateParent(id, updateForm);
  }

  @Delete(':id')
  async deleteParent(@Param('id') id: string) {
    await this.parentsService.deleteParent(id);
  }
}
