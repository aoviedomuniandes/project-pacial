/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendasList : TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tiendasList = [];
    for(let i = 0; i < 5; i++){
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.word.noun(),
        ciudad: faker.location.city(),
        direccion: faker.location.streetAddress({ useFullAddress: true }),
      })
      tiendasList.push(tienda);
    }

    producto = await productoRepository.save({
        nombre: faker.location.city(),
        precio: faker.number.int({ min: 1000, max: 50000 }),
        tipo: "Perecedero",
        tiendas: tiendasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('addTiendaToProducto should add a tienda to a producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.word.noun(),
      ciudad: faker.location.city(),
      direccion: faker.location.streetAddress({ useFullAddress: true }),
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.city(),
      precio: faker.number.int({ min: 1000, max: 50000 }),
      tipo: "Perecedero",
    })

    const result: ProductoEntity = await service.addTiendaToProducto(newProducto.id, newTienda.id);

    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre)
    expect(result.tiendas[0].ciudad).toBe(newTienda.ciudad)
    expect(result.tiendas[0].direccion).toBe(newTienda.direccion)
  });

  it('addTiendaToProducto should thrown exception for an invalid tienda', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.noun(),
      precio: faker.number.int({ min: 1000, max: 50000 }),
      tipo: "Perecedero",
    });

    await expect(() => service.addTiendaToProducto(newProducto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('addTiendaToProducto should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.word.noun(),
      ciudad: faker.location.city(),
      direccion: faker.location.streetAddress({ useFullAddress: true }),
    });
    
    await expect(() => service.addTiendaToProducto("0", newTienda.id)).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('findTiendaFromProducto should return tienda by producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const storedTienda: TiendaEntity = await service.findTiendaFromProducto(producto.id, tienda.id)
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
    expect(storedTienda.direccion).toBe(tienda.direccion);
  });
  
  it('findTiendaFromProducto should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findTiendaFromProducto(producto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('findTiendaFromProducto should throw an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    expect(() => service.findTiendaFromProducto("0", tienda.id)).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('findTiendaFromProducto should throw an exception for a tienda not associated to the producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.word.noun(),
      ciudad: faker.location.city(),
      direccion: faker.location.streetAddress({ useFullAddress: true }),
    });

    await expect(() => service.findTiendaFromProducto(producto.id, newTienda.id)).rejects.toHaveProperty("message", "The tienda with the given id is not associated to the producto");
  });

  it('findTiendasFromProducto should return tiendas by producto', async () => {
    const tiendas: TiendaEntity[] = await service.findTiendasFromProducto(producto.id);
    expect(tiendas.length).toBe(5)
  });

  it('findTiendasFromProducto should throw an exception for an invalid producto', async () => {
    await expect(() => service.findTiendasFromProducto("0")).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('updateTiendasFromProducto should update tiendass list for a producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.word.noun(),
      ciudad: faker.location.city(),
      direccion: faker.location.streetAddress({ useFullAddress: true }),
    });

    const updatedProducto: ProductoEntity = await service.updateTiendasFromProducto(producto.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);

    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('updateTiendasFromProducto should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.word.noun(),
      ciudad: faker.location.city(),
      direccion: faker.location.streetAddress({ useFullAddress: true }),
    });

    await expect(() => service.updateTiendasFromProducto("0", [newTienda])).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('updateTiendasFromProducto should throw an exception for an invalid tienda', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = "0";

    await expect(() => service.updateTiendasFromProducto(producto.id, [newTienda])).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('deleteTiendaFromProducto should remove a tienda from a producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];

    await service.deleteTiendaFromProducto(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({where: {id:producto.id}, relations: ["tiendas"]});
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(a => a.id === tienda.id);

    expect(deletedTienda).toBeUndefined();
  });

  it('deleteTiendaFromProducto should thrown an exception for an invalid tienda', async () => {
    await expect(() => service.deleteTiendaFromProducto(producto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('deleteTiendaFromProducto should thrown an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(() => service.deleteTiendaFromProducto("0", tienda.id)).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('deleteTiendaFromProducto should thrown an exception for an non associated tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.word.noun(),
      ciudad: faker.location.city(),
      direccion: faker.location.streetAddress({ useFullAddress: true }),
    });

    await expect(() => service.deleteTiendaFromProducto(producto.id, newTienda.id)).rejects.toHaveProperty("message", "The tienda with the given id is not associated to the producto");
  });
});

