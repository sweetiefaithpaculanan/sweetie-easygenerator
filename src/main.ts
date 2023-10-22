import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  
  await app.listen(2001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
