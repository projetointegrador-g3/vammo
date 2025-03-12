import { ApiProperty } from "@nestjs/swagger"
import { Transform, TransformFnParams } from "class-transformer"
import { IsDate, IsEmail, IsNotEmpty, Max, Min, MinLength } from "class-validator"
import {Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Viagem } from "../../viagem/entities/viagem.entity"

@Entity({name:"tb_usuarios"})
export class Usuario{

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id:number

 
    @Column({length:255, nullable: true})
    @ApiProperty()
    tipo_user:string

    @IsNotEmpty()
    @Column({length:255, nullable:false})
    @ApiProperty()
    nome:string

    @IsNotEmpty()
    @Transform(({value}:TransformFnParams)=>value?.trim())
    @Column({length:10, nullable:false})
    @ApiProperty()
    data_aniversario:string

    @Column({length:255, nullable: true})
    @ApiProperty()
    genero:string

    @IsNotEmpty()
    @IsEmail()
    @Column({length:255, nullable:false})
    @ApiProperty({example:"email@email.com.br"})
    usuario:string

    @IsNotEmpty()
    @MinLength(8)
    @Transform(({value}:TransformFnParams)=>value?.trim())
    @Column({length:255, nullable:false})
    @ApiProperty()
    senha:string

    @Column({length:5000, nullable: true})
    @ApiProperty()
    foto:string

  
    @Transform(({value})=>parseFloat(parseFloat(value).toFixed(2)))
    @Min(0)
    @Max(5)
    @ApiProperty()
    @Column({ nullable: true })
    avaliacao:number

    // Se usuário foi autenticado pelo Google
    // @Column({ default: 'local' }) 
    // provider: string;

    // Relacionamentos 
    @ApiProperty() 
    @OneToMany(() => Viagem, (viagem) => viagem.usuario) 
    viagem: Viagem []
}
