/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaService } from './tienda.service';

import { faker } from '@faker-js/faker';
describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();
 
    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for(let i = 0; i < 5; i++){
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.word.noun(),
        ciudad:  faker.word.interjection(3),
        direccion: faker.location.streetAddress({ useFullAddress: true })
    })
    tiendasList.push(tienda)
  }
  }
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne should return a tienda by id', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect (tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
    expect(tienda.ciudad).toEqual(storedTienda.ciudad);
    expect(tienda.direccion).toEqual(storedTienda.direccion);
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });

  it('create should return a new tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.word.noun(),
      ciudad: faker.word.interjection(3),
      direccion: faker.location.streetAddress({ useFullAddress: true }),
      productos: [],
    }

    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre);
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad);
    expect(storedTienda.direccion).toEqual(newTienda.direccion);
  });

  it('update should modify a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = "New name";
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
    const storedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id}});
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre)
  });

  it('update should throw an exception for an invalid tienda', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda, nombre: "New name"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });

  it('delete should remove a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
    const deletedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id }})
    expect(deletedTienda).toBeNull();
  });

  it('delete should throw an exception for an invalid tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id)
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });
  
 });
 
