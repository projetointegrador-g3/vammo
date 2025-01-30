import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Viagem } from "../entities/viagem.entity";

@Injectable()
export class ViagemService {
    constructor(
        @InjectRepository(Viagem)
        private viagemRepository: Repository<Viagem>,
        //private veiculoService: VeiculoService
    ) { }
    async findAll(): Promise<Viagem[]> {
        return await this.viagemRepository.find({
            /*relations: {
                //veiculo: true,
                usuario: true
            }*/
        });
    }

    async findById(id: number): Promise<Viagem> {
        const viagem = await this.viagemRepository.findOne({
            where: {
                id
            },
            /*relations: {
               veiculo: true,
                usuario: true
            }*/
        });
        if (!viagem)
            throw new HttpException('Viagem não encontrada!', HttpStatus.NOT_FOUND);

        return viagem;
    }

    async findAllByTitulo(titulo: string): Promise<Viagem[]> {
        return await this.viagemRepository.find({
            where: {
                //veiculo: ILike(`%${titulo}%`)
            },
            /*relations: {
                veiculo: true,
                usuario: true
            }*/
        });
    }

    async create(viagem: Viagem): Promise<Viagem> {
        //await this.veiculoService.findById(viagem.veiculo.id);
        return await this.viagemRepository.save(viagem);
    }

    async update(viagem: Viagem): Promise<Viagem> {
        await this.findById(viagem.id);
        //await this.veiculoService.findById(viagem.veiculo.id);
        return await this.viagemRepository.save(viagem);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);
        return await this.viagemRepository.delete(id);
    }
}
