import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { UsuarioLogin } from './../entities/usuariologin.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Usuarios') 
@Controller('/usuarios')
export class AuthController {
    
    constructor(private authService: AuthService) { }

    // Login com email e senha
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    login(@Body() usuario: UsuarioLogin): Promise<any> {
        return this.authService.login(usuario);
    }

    // Login com Google
    @Post('/login')
    async googleLogin(@Body('token') token: string) {
        return this.authService.loginWithGoogle(token);
    }
}