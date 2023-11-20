/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { TiendaController } from './tienda.controller';

@Module({
  providers: [TiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  controllers: [TiendaController]
})
export class TiendaModule {}

