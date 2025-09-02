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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('signals')
@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new x-ray signal' })
  @ApiResponse({ status: 201, description: 'Signal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() xray: XRay) {
    return this.signalsService.create(xray);
  }

  @Get()
  @ApiOperation({ summary: 'Get all x-ray signals' })
  @ApiResponse({ status: 200, description: 'List of all signals' })
  async findAll() {
    return this.signalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific x-ray signal by ID' })
  @ApiResponse({ status: 200, description: 'Signal found' })
  @ApiResponse({ status: 404, description: 'Signal not found' })
  async findOne(@Param('id') id: string) {
    return this.signalsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an x-ray signal' })
  @ApiResponse({ status: 200, description: 'Signal updated' })
  @ApiResponse({ status: 404, description: 'Signal not found' })
  async update(@Param('id') id: string, @Body() updateXRay: XRay) {
    return this.signalsService.update(id, updateXRay);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an x-ray signal' })
  @ApiResponse({ status: 200, description: 'Signal deleted' })
  @ApiResponse({ status: 404, description: 'Signal not found' })
  async delete(@Param('id') id: string) {
    return this.signalsService.delete(id);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter x-ray signals by deviceId and startTime' })
  @ApiQuery({ name: 'deviceId', required: false, type: String })
  @ApiQuery({ name: 'startTime', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Filtered signals' })
  async filter(
    @Query('deviceId') deviceId?: string,
    @Query('startTime') startTime?: number,
  ) {
    return this.signalsService.filter(
      deviceId || '',
      startTime ? Number(startTime) : 0,
    );
  }
}
