import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  guest_phone: string;

  @Column({ type: 'varchar', length: 255 })
  guest_name: string;

  @Column({ type: 'text', nullable: true })
  guest_message: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 20 })
  payment_method: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  payment_status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_id: string | null;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
