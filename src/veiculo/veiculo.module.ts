import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Veiculo } from "./entities/veiculo.entity";
import { VeiculoController } from "./controlles/veiculo.controller";
import { VeiculoService } from "./services/veiculo.service";

@Module({
    imports:[TypeOrmModule.forFeature([Veiculo])],
    controllers:[VeiculoController],
    providers:[VeiculoService],
    exports:[TypeOrmModule],
})
export class VeiculoModule{}