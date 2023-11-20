/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Entity()
export class TiendaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
  
    @Column()
    ciudad: string;
  
    @Column()
    direccion: string;

    @ManyToMany(() => ProductoEntity, producto => producto.tiendas)
    productos: ProductoEntity[];

}