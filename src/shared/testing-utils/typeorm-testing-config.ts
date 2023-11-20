/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../../tienda/tienda.entity';
import { ProductoEntity } from '../../producto/producto.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [TiendaEntity, ProductoEntity],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([TiendaEntity, ProductoEntity]),
];