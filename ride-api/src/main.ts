import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  await app.listen(PORT, () => {
    console.log(`The Serve is Listening at Port: http://localhost:${PORT}/api`);
  });
}
bootstrap();
