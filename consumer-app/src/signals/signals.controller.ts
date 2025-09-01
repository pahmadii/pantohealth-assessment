/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { SignalsService } from './signals.service';
import { XRay } from './schemas/xray.schema';

@Controller('signals')
export class SignalsController {
  constructor(private signalsService: SignalsService) {}

  @Post()
  async create(@Body() xray: XRay) {
    return this.signalsService.create(xray);
  }

  @Get()
  async findAll() {
    return this.signalsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.signalsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateXRay: XRay) {
    return this.signalsService.update(id, updateXRay);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.signalsService.delete(id);
  }

  @Get('filter')
  async filter(
    @Query('deviceId') deviceId: string,
    @Query('startTime') startTime: number,
  ) {
    return this.signalsService.filter(deviceId, startTime);
  }
}
