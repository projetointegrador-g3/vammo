import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';
import { OAuth2Client } from 'google-auth-library';

// Cliente ID do Google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService{
    
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ){ }

    async validateUser(username: string, password: string): Promise<any>{

        const buscaUsuario = await this.usuarioService.findByUsuario(username)

        if(!buscaUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND)

        const matchPassword = await this.bcrypt.compararSenhas(password, buscaUsuario.senha)

        if(buscaUsuario && matchPassword){
            const { senha, ...resposta } = buscaUsuario
            return resposta
        }

        return null
    }

    // Login com email e senha
    async login(usuarioLogin: UsuarioLogin){

        const payload = { sub: usuarioLogin.usuario }

        const buscaUsuario = await this.usuarioService.findByUsuario(usuarioLogin.usuario)

        if (!buscaUsuario)
            throw new HttpException("⚠️ O Usuario já existe!", HttpStatus.BAD_REQUEST)
        
        return{
            id: buscaUsuario.id,
            nome: buscaUsuario.nome,
            usuario: usuarioLogin.usuario,
            senha: '',
            foto: buscaUsuario.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`,
        }
    }

    // Login com Google
    async loginWithGoogle(token: string) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.VITE_GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new HttpException('Falha na autenticação com Google', HttpStatus.UNAUTHORIZED);
            }

            // Garantir que os valores não sejam undefined
            const email = payload.email ?? ''; // Se for undefined, vira string vazia
            const name = payload.name ?? 'Usuário Google'; // Nome padrão se não vier
            const picture = payload.picture ?? 'https://example.com/default-avatar.png'; // Foto padrão

            if (!email) {
                throw new HttpException('Email não encontrado no Google', HttpStatus.BAD_REQUEST);
            }

            let usuario = await this.usuarioService.findByUsuario(email);

            if (!usuario) {
                usuario = await this.usuarioService.create({
                    id: 0,                    
                    nome: name,
                    usuario: email,
                    senha: '',  // Google não exige senha
                    foto: picture,
                    tipo_user: 'comum', // Definindo o tipo_user como 'google' (valor padrão)
                    data_aniversario: null, // Definindo null para o aniversário
                    genero: '', // Definindo uma string vazia para o gênero
                    avaliacao: 0,  
                    viagem: [], 
                });
            }

            const jwtPayload = { sub: usuario.usuario };
            const appToken = this.jwtService.sign(jwtPayload);

            return {
                id: usuario.id,
                nome: usuario.nome,
                usuario: usuario.usuario,
                foto: usuario.foto,
                token: `Bearer ${appToken}`,
            };
        } catch (error) {
            throw new HttpException('Erro ao autenticar com Google', HttpStatus.UNAUTHORIZED);
        }
    }
}