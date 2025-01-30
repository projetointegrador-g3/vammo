/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Veiculo } from "../entities/veiculo.entity";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class VeiculoService{
    constructor(
        @InjectRepository(Veiculo)
        private veiculoRepository: Repository<Veiculo>
    ){}

    async findAll(): Promise<Veiculo[]> {
        return await this.veiculoRepository.find({})
    }

    async findByModelo(modelo: string): Promise<Veiculo[]>{
        const veiculo = await  this.veiculoRepository.find({
            where: {
                modelo: ILike(`%${modelo}%`)
            }
        })
        if (veiculo.length === 0) {  
            throw new HttpException(`⚠️ Nenhum resultado encontrado com o ${modelo}`, HttpStatus.NOT_FOUND);
            }  
        return veiculo;
    }

    async findById(id: number): Promise<Veiculo> {

        const veiculo = await this.veiculoRepository.findOne({
            where: {
                id
            },
        });
        if (!veiculo)
            throw new HttpException('Veículo não encontrado!', HttpStatus.NOT_FOUND);

        return veiculo;
    }

    async create(veiculo: Veiculo): Promise<Veiculo>{

        const ano = veiculo.data_fabricacao;
        if (ano < '2020')
            throw new HttpException('⚠️ veiculo fora da data aceitável', HttpStatus.FORBIDDEN);

        return await this.veiculoRepository.save(veiculo)
    }

    async update(veiculo: Veiculo): Promise<Veiculo>{

        await this.findById(veiculo.id)

        return await this.veiculoRepository.save(veiculo)
    }

    
    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id)

        return await this.veiculoRepository.delete(id)
    }

/*
     async getVeiculoDisponivel(): Promise<any[]> {  
        const results = await this.veiculoRepository.createQueryBuilder('veiculo')   
            .where('veiculo.disponivel = :disponivel', { disponivel: true })  
            .select(['veiculo.modelo AS Veiculo', 'veiculo.placa AS Placa', 'veiculo.disponivel AS Disponivel'])  
            .getRawMany();  
    
        if (results.length === 0) {  
            throw new HttpException('🚫 Nenhum veículo disponível encontrado.', HttpStatus.NOT_FOUND);  
        }  
        return results;
    
    }  
*/

}