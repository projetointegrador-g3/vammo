import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Veiculo } from "../../veiculo/entities/veiculo.entity"
import { Usuario } from "../../usuario/entities/usuario.entity"

@Entity({name: "tb_viagens"})
export class Viagem {

    @PrimaryGeneratedColumn() 
    @ApiProperty() 
    id: number

    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    @ApiProperty() 
    origem: string

    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    @ApiProperty() 
    destino: string

    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    @ApiProperty() 
    distancia: string

    @IsNotEmpty()
    @ApiProperty() 
    preco: number

    @IsNotEmpty()
    @ApiProperty() 
    velocidade: number

    @ApiProperty()  
    @UpdateDateColumn()
    data_ida: Date

    @IsNotEmpty()
    @Column({length: 255, nullable: false }) 
    @ApiProperty() 
    status: string

    // Relacionamentos 
    @ApiProperty({ type: () => Veiculo })  
    @ManyToOne(() => Veiculo, (veiculo) => veiculo.viagem, {
        onDelete: "CASCADE"
    })
    veiculo: Veiculo

    @ApiProperty({ type: () => Usuario })  
    @ManyToOne(() => Usuario, (usuario) => usuario.viagem, {
            onDelete: "CASCADE"
        })
        usuario: Usuario

}