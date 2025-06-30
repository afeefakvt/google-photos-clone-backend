import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)
  const clientUrl = configService.get<string>('FRONTEND_URL')

  app.enableCors({
    origin:clientUrl,
    credentials:true,
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
