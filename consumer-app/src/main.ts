/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('XRay Signals API')
    .setDescription('API documentation for XRay signals')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // این مسیر http://localhost:3000/api میشه

  const port = 3000;
  await app.listen(port);
  console.log(` Consumer app listening on http://localhost:${port}`);
}

bootstrap();
