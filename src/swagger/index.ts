import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocument, SwaggerModule } from '@nestjs/swagger';

import { SwaggerTags } from '../constants';

const SWAGGER_PATH = 'swagger';

const swaggerOptions = new DocumentBuilder()
    .setTitle('Online University API')
    .setDescription('The list of possible requests to server.')
    .setVersion('1.0')
    .addTag(SwaggerTags.Login)
    .addTag(SwaggerTags.Users)
    .addTag(SwaggerTags.Courses)
    .addTag(SwaggerTags.Chats)
    .addBearerAuth()
    .build();

export class Swagger {
    public static createDocument(app: INestApplication): SwaggerDocument {
        return SwaggerModule.createDocument(app, swaggerOptions);
    }

    public static setup(app: INestApplication): void {
        const document: SwaggerDocument = Swagger.createDocument(app);

        SwaggerModule.setup(SWAGGER_PATH, app, document);
    }
}
