import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Headers, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { UsuarioService } from "../services/usuario.service";
import { Usuario } from "../entities/usuario.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";

@ApiBearerAuth()
@ApiTags('Usuarios')
@Controller("/usuarios")
export class UsuarioController{
    
    constructor(private readonly usuarioService:UsuarioService){}

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Usuario[]>{
        return this.usuarioService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario>{
        return this.usuarioService.findByID(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get("/genero/:genero")
    @HttpCode(HttpStatus.OK)
    findByGenero(@Param("genero")genero:string):Promise<Usuario[]>{
        return this.usuarioService.findByGenero(genero)
    }

    @Post("/cadastrar")
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() usuario: Usuario): Promise<Usuario>{
        return this.usuarioService.create(usuario)
    }
 
    @UseGuards(JwtAuthGuard)
    @Put('/atualizar')
    @HttpCode(HttpStatus.OK)
    async update(@Body() usuario: Usuario): Promise<Usuario>{
        return this.usuarioService.update(usuario)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/email/:usuario')
    @HttpCode(HttpStatus.OK)
    findByEmail(@Param('usuario') usuario:string): Promise<Usuario[]>{
        return this.usuarioService.findByEmail(usuario);
    }

    @Get('/usuarios/googlelogin')
    async googleLogin(@Headers('Authorization') authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new HttpException('Token não fornecido', HttpStatus.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];
        try {
            const payload = await this.usuarioService.validateGoogleToken(token);
            const usuario = await this.usuarioService.findOrCreateFromGoogle(payload);
            return usuario;
        } catch (error) {
            throw error;
        }
    }
    
}