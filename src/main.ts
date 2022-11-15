import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT || 3000);
    console.info(`App Listening on port ${process.env.PORT || 3000}`);
  } catch (err) {
    console.error(`Fatal error can't boot application.`, err.message);
    process.exit(1);
  }
}
bootstrap();
