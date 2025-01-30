import {forwardRef, Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity";
import { UsuarioService } from "./services/usuario.service";
import { UsuarioController } from "./controllers/usuario.controller";
import { AuthModule } from "../auth/auth.module";
import { Bcrypt } from "../auth/bcrypt/bcrypt";

@Module({
    imports:[TypeOrmModule.forFeature([Usuario]), forwardRef(() => AuthModule), ],
    controllers:[UsuarioController],
    providers:[Bcrypt,UsuarioService],
    exports:[TypeOrmModule, UsuarioService]
})
export class UsuarioModule{}