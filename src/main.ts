import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { TransformInterceptor } from "src/shared/interceptors/transform.interceptor";
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from 'fs';
import { RoleGuard } from "./auth/guards/role.guard";


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RoleGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  app.useGlobalPipes(new ValidationPipe())
  // config cookie
  app.use(cookieParser());

  // config cors
  app.enableCors(
    {
      "origin": true,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      credentials: true
    }
  );

  //config versioning
  app.setGlobalPrefix("api")
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"]
  });

  // --- SWAGGER SETUP START ---
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('Blood Donation Services')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, 
    {
    swaggerOptions: {
      authAction: {
        'access-token': {
          name: 'Authorization',
          schema: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'Bearer <your-token-here>',
        },
      },
    },
  });

  // --- SWAGGER SETUP END ---

  // fs.writeFileSync('./swagger.json', JSON.stringify(document));
  // export file
  await app.listen(configService.get<string>("PORT"));
}
bootstrap();
