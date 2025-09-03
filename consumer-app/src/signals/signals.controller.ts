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
import { CreateXRayDto } from './dto/create-xray.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('signals')
@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new x-ray signal' })
  @ApiResponse({
    status: 201,
    description: 'X-ray signal created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createXRayDto: CreateXRayDto) {
    return this.signalsService.create(createXRayDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all x-ray signals' })
  async findAll() {
    return this.signalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an x-ray signal by ID' })
  async findOne(@Param('id') id: string) {
    return this.signalsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an x-ray signal by ID' })
  @ApiResponse({
    status: 200,
    description: 'X-ray signal updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(@Param('id') id: string, @Body() updateXRayDto: CreateXRayDto) {
    return this.signalsService.update(id, updateXRayDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an x-ray signal by ID' })
  async delete(@Param('id') id: string) {
    return this.signalsService.delete(id);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter x-ray signals by deviceId and startTime' })
  @ApiQuery({ name: 'deviceId', required: false, type: String })
  @ApiQuery({ name: 'startTime', required: false, type: Number })
  async filter(
    @Query('deviceId') deviceId?: string,
    @Query('startTime') startTime?: number,
  ) {
    return this.signalsService.filter(deviceId, startTime);
  }
}
