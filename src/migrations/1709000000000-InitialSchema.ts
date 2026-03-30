import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1709000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS gifts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        category VARCHAR(100),
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        guest_phone VARCHAR(20) NOT NULL REFERENCES guests(phone),
        guest_name VARCHAR(255) NOT NULL,
        guest_message TEXT,
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'pending',
        payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        gift_id INTEGER NOT NULL REFERENCES gifts(id),
        gift_name VARCHAR(255) NOT NULL,
        gift_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        provider VARCHAR(50) NOT NULL,
        provider_payment_id VARCHAR(255) NOT NULL,
        method VARCHAR(20) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        pix_qr_code TEXT,
        pix_copy_paste TEXT,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_gifts_available ON gifts(is_available)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(guest_phone)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_payments_status`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_payments_order`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_order_items_order`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_orders_status`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_orders_phone`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_gifts_available`);
    await queryRunner.query(`DROP TABLE IF EXISTS payments`);
    await queryRunner.query(`DROP TABLE IF EXISTS order_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders`);
    await queryRunner.query(`DROP TABLE IF EXISTS guests`);
    await queryRunner.query(`DROP TABLE IF EXISTS gifts`);
  }
}
