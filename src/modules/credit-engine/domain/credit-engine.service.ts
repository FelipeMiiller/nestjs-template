import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class CreditService {
  constructor() {}

  @Get()
  findAll() {
    return 'Hello Credit Engine';
  }
}
