import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "../entities/usuario.entity";
import { privateDecrypt } from "crypto";
import { NumericType, Repository } from "typeorm";
import { differenceInYears } from "date-fns";

@Injectable()
export class UsuarioService{

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository:Repository<Usuario>
    ){}

    async findByUsuario(usuario:string):Promise<Usuario|null>{
        return await this.usuarioRepository.findOne({
            where:{
                usuario: usuario
            },
            relations:{
                viagem: true,
            }
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
        const dataNascimento=usuario.data_aniversario
        const [dia, mes, ano]=dataNascimento.split('/').map(Number)  
        const dataNascimentoDate=new Date(ano, mes-1, dia)
        const dataAtual=new Date()
        const idade=differenceInYears(dataAtual, dataNascimentoDate)
    
        if(idade<18)  
        throw new HttpException("⚠️ Usuário deve ter pelo menos 18 anos", HttpStatus.NOT_FOUND) 
        
        const buscaUsuario=await this.findByUsuario(usuario.usuario)

        if (buscaUsuario)
            throw new HttpException("⚠️ O Usuario já existe!", HttpStatus.BAD_REQUEST)
        return await this.usuarioRepository.save(usuario)
    }

    async update(usuario:Usuario):Promise<Usuario>{
        await this.findByID(usuario.id)
        
        const buscaUsuario=await this.findByUsuario(usuario.usuario)

        if(buscaUsuario && buscaUsuario.id!==usuario.id)
            throw new HttpException("⚠️ Usuário já está cadastrado!", HttpStatus.BAD_REQUEST)
        await this.create(usuario)
        return await this.usuarioRepository.save(usuario)
    }
}