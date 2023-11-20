/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';
import { TiendaEntity } from './tienda/tienda.entity';
import { ProductoEntity } from './producto/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';

@Module({
  imports: [TiendaModule, ProductoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [ProductoEntity,TiendaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ProductoTiendaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
