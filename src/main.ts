import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Vammo 🚗🚘')
  .setDescription('Vammo - Projeto Integrador Grupo 03')
  .setContact("Grupo 03","https://github.com/projetointegrador-g3/vammo","grupo03integrador@gmail.com")
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
  
  process.env.TZ = '-03:00';

  app.useGlobalPipes(new ValidationPipe());

  // Atovar CORS com origens permitidas
  app.enableCors(
    {
      origin: ["http://localhost:5173", "https://vammo.netlify.app"], // Domínios que podem acessar o backend
      methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      allowedHeaders: "Content-Type, Authorization",
      credentials: true,
    }
  )
  await app.listen(process.env.PORT || 4000);
}
bootstrap();

