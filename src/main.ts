import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';

import { AppModule } from './app.module';

import { Swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors(); // TODO: Cors settings

  Swagger.setup(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
