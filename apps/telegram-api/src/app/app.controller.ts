import { Controller, Get, Query } from '@nestjs/common';
import { TelegramService } from './app.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('getCode')
  async getCode() {
    return this.telegramService.requestCode();
  }

  @Get('authenticateWithCode')
  async authenticateWithCode(@Query('code') code: string) {
    return this.telegramService.authenticateWithCode(code);
  }

  @Get('getGroupMessages')
  async getGroupMessages(@Query('groupName') groupName: string, @Query('limit') limit: number) {
    return this.telegramService.getGroupMessages(groupName, limit);
  }
}
