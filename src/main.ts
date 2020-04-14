import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'body-parser';
import * as helmet from 'helmet';

import { AppModule } from './app.module';

import { Swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors(); // TODO: Cors settings

  app.use(json({ limit: '3mb' }));
  app.use(urlencoded({ limit: '3mb', extended: true }));

  Swagger.setup(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
