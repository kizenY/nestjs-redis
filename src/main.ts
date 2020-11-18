import { NestFactory } from '@nestjs/core';
import { NestRedisModule } from './redis.module';

async function bootstrap() {
  const app = await NestFactory.create(NestRedisModule);
  await app.listen(3000);
}
bootstrap();
