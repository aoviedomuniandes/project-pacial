/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm'
import { ProductoEntity } from './producto.entity';

@Injectable()
export class ProductoService {

  tiposProductoPermitidos: string[] = ["Perecedero", "No perecedero"];

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({ relations: ['tiendas'] });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });

    if (!producto)
        throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    
    if (!producto || !this.tiposProductoPermitidos.includes(producto.tipo) ) {
        throw new BusinessLogicException("Invalid producto data", BusinessError.PRECONDITION_FAILED);
    }

    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity = await this.productoRepository.findOne({ where: { id } });

    if (!persistedProducto) {
      throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
    }

    return await this.productoRepository.save({...persistedProducto, ...producto});
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id } });

    if (!producto) {
        throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
    }

    await this.productoRepository.remove(producto);
  }
}

