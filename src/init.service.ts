import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RFID_MODE } from './enums/rfid_mode.enum';

@Injectable()
export class InitializerService implements OnApplicationBootstrap {
  constructor(@Inject('CACHE_MANAGER') private cache: Cache) {}

  async onApplicationBootstrap() {
    // initialize default values in cache
    await this.cache.set('rfid_mode', RFID_MODE.READ);
    console.log('✅ Cache initialized with default values');
  }
}
