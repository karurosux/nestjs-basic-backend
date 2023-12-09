import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import {AuthConstants} from './auth/auth.constants';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const documentConfig = new DocumentBuilder()
    .setTitle("MyApp's API")
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards();
  app.use(cookieParser());
  app.use(
    session({
      secret: AuthConstants.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();
