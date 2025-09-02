import { Controller, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('producer')
export class ProducerController {
  constructor(private producerService: ProducerService) {}

  @Post('send')
  async sendSampleData() {
    const sampleData = {
      '66bb584d4ae73e488c30a072': {
        data: [
          [762, [51.339764, 12.339223833333334, 1.2038000000000002]],
          [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
          [2763, [51.339782, 12.339196166666667, 2.13906]],
        ],
        time: 1735683480000,
      },
    };
    await this.producerService.sendXRayData(sampleData);
    return { message: 'Data sent to queue' };
  }
}
