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

    @IsNotEmpty()
    @Column({length:255, nullable:false})
    @ApiProperty()
    tipo:string
    //Motorista ou usuário

    @IsNotEmpty()
    @Column({length:255, nullable:false})
    @ApiProperty()
    nome:string

    @IsNotEmpty()
    @Transform(({value}:TransformFnParams)=>value?.trim())
    @Column({length:10, nullable:false})
    @ApiProperty()
    data_aniversario:string

    @IsNotEmpty()
    @Column({length:255, nullable:false})
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

    @Column({length:5000})
    @ApiProperty()
    foto:string

    @IsNotEmpty()
    @Transform(({value})=>parseFloat(parseFloat(value).toFixed(2)))
    @Min(0)
    @Max(5)
    @ApiProperty()
    avaliacao:number

    // Relacionamentos 
    @OneToMany(() => Viagem, (viagem) => viagem.usuario) 
    viagem: Viagem []
}