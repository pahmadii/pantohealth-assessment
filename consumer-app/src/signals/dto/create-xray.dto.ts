/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DataPoint {
  @ApiProperty({
    example: [762, [51.339764, 12.339223833333334, 1.2038]],
    description: 'Time and coordinates [time, [x, y, speed]]',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Number)
  values: [number, [number, number, number]];
}

export class CreateXRayDto {
  @ApiProperty({
    example: '66bb584d4ae73e488c30a072',
    description: 'Device ID',
  })
  @IsString()
  deviceId: string;

  @ApiProperty({ example: 1735683480000, description: 'Timestamp' })
  @IsNumber()
  time: number;

  @ApiProperty({ example: 563, description: 'Number of data points' })
  @IsNumber()
  dataLength: number;

  @ApiProperty({ example: 12345, description: 'Data volume in bytes' })
  @IsNumber()
  dataVolume: number;

  @ApiProperty({ type: [DataPoint], description: 'Array of data points' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DataPoint)
  data: DataPoint[];
}
