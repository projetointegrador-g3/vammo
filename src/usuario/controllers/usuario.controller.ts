import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Headers, Param, ParseIntPipe, Post, Put, UseGuards, Logger } from "@nestjs/common";
import { UsuarioService } from "../services/usuario.service";
import { Usuario } from "../entities/usuario.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";

@ApiBearerAuth()
@ApiTags('Usuarios')
@Controller("/usuarios")
export class UsuarioController{
    
    // logs
    private readonly logger = new Logger(UsuarioController.name);
    
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

    // @Get('/googlelogin')
    // async googleLogin(@Headers('Authorization') authHeader: string) {
    //     this.logger.log('Requisição recebida em /usuarios/googlelogin');

    //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //         this.logger.warn('Token não fornecido');
    //         throw new HttpException('Token não fornecido', HttpStatus.UNAUTHORIZED);
    //     }

    //     const token = authHeader.split(' ')[1];
    //     this.logger.log(`Token recebido: ${token}`);

    //     try {
    //         const payload = await this.usuarioService.validateGoogleToken(token);
    //         this.logger.log(`Payload do Google: ${JSON.stringify(payload)}`);

    //         const usuario = await this.usuarioService.findOrCreateFromGoogle(payload);
    //         this.logger.log(`Usuário encontrado/criado: ${JSON.stringify(usuario)}`);

    //         return usuario;
    //     } catch (error) {
    //         this.logger.error(`Erro ao processar login do Google: ${error.message}`, error.stack);
    //         throw error;
    //     }
    // }
}