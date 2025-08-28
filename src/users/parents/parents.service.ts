import { Injectable } from '@nestjs/common';
import { RegisterParentDto } from '../../common/dto/register-parent.dto';

@Injectable()
export class ParentsService {
  registerParent(registerParentDto: RegisterParentDto) {
    console.log(registerParentDto);
  }
}
