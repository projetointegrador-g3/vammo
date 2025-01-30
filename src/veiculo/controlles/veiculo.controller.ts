/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { VeiculoService } from "../services/veiculo.service";
import { Veiculo } from "../entities/veiculo.entity";

@Controller('/veiculo')
export class VeiculoController{
    constructor(
        private readonly veiculoService: VeiculoService
    ){}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Veiculo[]>{
        return this.veiculoService.findAll()
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Veiculo>{
        return this.veiculoService.findById(id)
    }

    @Get('/veiculo/:modelo')
    @HttpCode(HttpStatus.OK)
    findByModelo(@Param ('modelo') modelo: string): Promise<Veiculo[]>{
        return this.veiculoService.findByModelo(modelo)
    }

    /*
    @Get('/disponivel')  
    @HttpCode(HttpStatus.OK)  
    async getVeiculoDisponivel(): Promise<{ modelo: string; placa: string; disponivel: boolean }[]> {  
        return this.veiculoService.getVeiculoDisponivel();  
    }
    */

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() produto: Veiculo): Promise<Veiculo>{
        return this.veiculoService.create(produto)
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    update(@Body() produto: Veiculo): Promise<Veiculo>{
        return this.veiculoService.update(produto)
    }

    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number){
        return this.veiculoService.delete(id)
    }


}