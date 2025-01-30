import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity";
import { UsuarioService } from "./services/usuario.service";
import { UsuarioController } from "./controllers/usuario.controller";

@Module({
    imports:[TypeOrmModule.forFeature([Usuario])],
    controllers:[UsuarioService],
    providers:[UsuarioController],
    exports:[TypeOrmModule]
})
export class UsuarioModule{}