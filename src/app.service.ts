import { Inject, Injectable } from '@nestjs/common';
import { RfidTapGateway } from './gateways/rfid-tap-.gateway';
import { ConfigService } from '@nestjs/config';
import { RFID_MODE } from './enums/rfid_mode.enum';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject('CACHE_MANAGER') private cache: Cache) {}

  async change_mode(mode: RFID_MODE) {
    await this.cache.set('rfid_mode', mode);
  }
}
