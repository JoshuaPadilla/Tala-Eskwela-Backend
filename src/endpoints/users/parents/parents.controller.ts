import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ParentsService } from './parents.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateParentDto } from './dto/update-parent.dto';
import { User_Roles } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/role.guard';
import { Request } from 'express';

@User_Roles(Roles.TEACHER)
@UseGuards(JwtAuthGuard, RolesGuard)
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

  @User_Roles(Roles.PARENT)
  @Patch(':id')
  async updateParent(
    @Param('id') id: string,
    @Body() updateForm: UpdateParentDto,
    @Req() req: Request,
  ) {
    const user: any = req.user;
    console.log(user);

    if (!user) {
      throw new BadRequestException();
    }

    if (id !== user.userId) {
      throw new UnauthorizedException('You are not authorized to edit this');
    }

    return await this.parentsService.updateParent(id, updateForm);
  }

  @Delete(':id')
  async deleteParent(@Param('id') id: string) {
    await this.parentsService.deleteParent(id);
  }
}
