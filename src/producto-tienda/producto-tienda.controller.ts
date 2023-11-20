/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaDto } from '../tienda/tienda.dto';
import { TiendaEntity } from 'src/tienda/tienda.entity';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
    constructor(private readonly productoTiendaService: ProductoTiendaService){}

    @Post(':productoId/tiendas/:tiendaId')
    async addTiendaToProducto(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
       return await this.productoTiendaService.addTiendaToProducto(productoId, tiendaId);
    }

    @Get(':productoId/tiendas/:tiendaId')
    async findTiendaFromProducto(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.findTiendaFromProducto(productoId, tiendaId);
    }

    @Get(':productoId/tiendas')
    async findTiendasFromProducto(@Param('productoId') productoId: string){
        return await this.productoTiendaService.findTiendasFromProducto(productoId);
    }

    @Put(':productoId/tiendas')
    async updateTiendasFromProducto(@Body() tiendasDto: TiendaDto[], @Param('productoId') productoId: string){
        const tiendas = plainToInstance(TiendaEntity, tiendasDto)
        return await this.productoTiendaService.updateTiendasFromProducto(productoId, tiendas);
    }

    @Delete(':productoId/tiendas/:tiendaId')
    @HttpCode(204)
    async deleteTiendaFromProducto(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.deleteTiendaFromProducto(productoId, tiendaId);
    }
}

