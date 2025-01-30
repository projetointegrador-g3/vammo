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
        return await this.veiculoRepository.find({
            relations: {
                viagem: true,
            }
        })
    }

    async findByModelo(modelo: string): Promise<Veiculo[]>{
        const veiculo = await  this.veiculoRepository.find({
            where: {
                modelo: ILike(`%${modelo}%`)
            },
            relations: {
                viagem: true,
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
            relations: {
                viagem: true,
            }
        })

        if (!veiculo)
            throw new HttpException('⚠️ Veículo não encontrado!', HttpStatus.NOT_FOUND);

        return veiculo;
    }

    async create(veiculo: Veiculo): Promise<Veiculo>{
        const placa = veiculo.placa;
        const ano = veiculo.data_fabricacao;
        if (ano < '2020' || placa.length > 7 )
            throw new HttpException('⚠️ Veiculo fora da data aceitável, e/ou Placa está errada 〰️', HttpStatus.FORBIDDEN);

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


     async getVeiculoDisponivel(): Promise<{modelo: string; placa: string; disponivel: boolean }[]> {  
        const results = await this.veiculoRepository.createQueryBuilder('veiculo')   
            .where('veiculo.disponivel = :disponivel', { disponivel: true })  
            .select(['veiculo.modelo AS Veiculo', 'veiculo.placa AS Placa', 'veiculo.disponivel AS Disponivel'])  
            .getRawMany();  
    
        if (results.length === 0) {  
            throw new HttpException('🚫 Nenhum veículo disponível encontrado.', HttpStatus.NOT_FOUND);  
        }  
        return results;
    
    }  


}