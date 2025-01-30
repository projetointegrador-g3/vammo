import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdService } from './data/services/prod.service';
import { ViagemModule } from './viagem/viagem.module';
import { VeiculoModule } from './veiculo/veiculo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { DevService } from './data/services/dev.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ProdService, 
      imports: [ConfigModule],
    }),
    ViagemModule,
    VeiculoModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
