import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "../entities/usuario.entity";
import { ILike, NumericType, Repository } from "typeorm";
import { differenceInYears } from "date-fns";
import { Bcrypt } from "../../auth/bcrypt/bcrypt";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class UsuarioService{

    private readonly client: OAuth2Client; 

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt // Não esquecer
    ) {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Inicializa o cliente
    }

    async findByUsuario(usuario:string):Promise<Usuario | null>{
        return await this.usuarioRepository.findOne({
            where:{
                usuario: usuario
            },
            relations:{
                viagem: true,
            }
        })
    }

    async findByGenero(genero:string):Promise<Usuario[]>{
        return this.usuarioRepository.find({
            where:{genero:ILike(`%${genero}%`)}
        })
    }

    async findByEmail(email:string):Promise<Usuario[]>{
        return this.usuarioRepository.find({
            where:{usuario:ILike(`%${email}%`)}
        })
    }
    

    async findAll():Promise<Usuario[]>{
        return await this.usuarioRepository.find({
            relations:{
                viagem: true,
            }
        })
    }

    async findByID(id:number):Promise<Usuario>{

        const usuario=await this.usuarioRepository.findOne({
            where:{
                id
            },
            relations:{
                viagem: true,
            }
        })
        if(!usuario)
            throw new HttpException("⚠️ Usuário não encontrado", HttpStatus.NOT_FOUND)
        return usuario
    }

    async create(usuario:Usuario):Promise<Usuario>{

       //utilizando método para calcular a idade 
        await this.calculoIdade(usuario)

        const buscaUsuario=await this.findByUsuario(usuario.usuario)

        if (buscaUsuario)
            throw new HttpException("⚠️ O Usuario já existe!", HttpStatus.BAD_REQUEST)


        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario)
    }

 
    async update(usuario:Usuario):Promise<Usuario>{
       
        await this.findByID(usuario.id)
        
        const buscaUsuario=await this.findByUsuario(usuario.usuario)

        if(buscaUsuario && buscaUsuario.id!==usuario.id)
            throw new HttpException("⚠️ Usuário já está cadastrado!", HttpStatus.BAD_REQUEST)
        
        await this.calculoIdade(usuario)

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario)
    }

    // Métodos para Google Login API
    async validateGoogleToken(token: string): Promise<any> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            return payload;
        } catch (error) {
            console.error('Erro ao verificar token do Google:', error);
            throw new HttpException('Token do Google inválido ', HttpStatus.UNAUTHORIZED);
        }
    }

    async findOrCreateFromGoogle(payload: any): Promise<Usuario> {
        let usuario = await this.findByUsuario(payload.email);

        if (!usuario) {
            usuario = new Usuario();
            usuario.nome = payload.name;
            usuario.usuario = payload.email;
            usuario.foto = payload.picture;
            return await this.usuarioRepository.save(usuario);
        }

        return usuario;
    }


    //Método Extra para verificar a idade do usuário
    async calculoIdade(usuario: Usuario): Promise<Usuario>{
        const dataNascimento=usuario.data_aniversario
        const [dia, mes, ano]=dataNascimento.split('/').map(Number)  
        const dataNascimentoDate=new Date(ano, mes-1, dia)
        const dataAtual=new Date()
        const idade=differenceInYears(dataAtual, dataNascimentoDate)
    
        if(idade<18)  
             throw new HttpException(`⚠️ Usuário deve ter pelo menos 18 anos. Sua idade é ${idade} anos`, HttpStatus.NOT_FOUND) 
    
        return usuario;
    }
}