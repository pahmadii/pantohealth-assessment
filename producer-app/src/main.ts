/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
const rawData = fs.readFileSync('x-ray.json', 'utf8');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const xrayJson = JSON.parse(rawData);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Producer API')
    .setDescription('Producer endpoints for sending XRay data')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger روی /api

  // Producer روی پورت 3001
  const port = 3001;
  await app.listen(port);
  console.log(`📤 Producer app listening on http://localhost:${port}`);
  console.log(`📄 Swagger docs available at http://localhost:${port}/api`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
