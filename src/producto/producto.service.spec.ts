/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoService } from './producto.service';

import { faker } from '@faker-js/faker';
describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();
 
    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for(let i = 0; i < 5; i++){
      const producto: ProductoEntity = await repository.save({
        nombre: faker.word.noun(),
        precio: faker.number.int(),
        tipo: 'Perecedero',
      })
        productosList.push(producto);
    }
  }
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne should return a producto by id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect (producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
    expect(producto.tipo).toEqual(storedProducto.tipo);
  });

  it('findOne should throw an exception for an invalid producto', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The producto with the given id was not found")
  });

  it('create should return a new producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      nombre: faker.word.noun(),
      precio: faker.number.int(),
      tipo: 'Perecedero',
      tiendas: []
    }

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({where: {id: newProducto.id}})
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.precio).toEqual(newProducto.precio);
    expect(storedProducto.tipo).toEqual(newProducto.tipo);
  });

  it('update should modify a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'Banano';
    producto.precio = 10000;
    producto.tipo = "Perecedero";
    const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id}});
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
    expect(storedProducto.precio).toEqual(producto.precio);
    expect(storedProducto.tipo).toEqual(producto.tipo);
  });

  it('update should throw an exception for an invalid producto', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,  nombre: 'Jabon', precio: 1500,  tipo: "No perecedero",
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "The producto with the given id was not found")
  });

  it('delete should remove a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id }})
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id)
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The producto with the given id was not found")
  });
 
 });



