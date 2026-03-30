import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGuestDocumentAndRelation1709000000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE guests ADD COLUMN document VARCHAR(14) UNIQUE
    `);

    await queryRunner.query(`
      ALTER TABLE orders ADD COLUMN guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      UPDATE orders
      SET guest_id = guests.id
      FROM guests
      WHERE orders.guest_phone = guests.phone
    `);

    await queryRunner.query(`
      ALTER TABLE orders ALTER COLUMN guest_id SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_guest_phone_fkey
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_orders_phone`);
    await queryRunner.query(`ALTER TABLE orders DROP COLUMN guest_phone`);
    await queryRunner.query(`ALTER TABLE orders DROP COLUMN guest_name`);

    await queryRunner.query(`CREATE INDEX idx_orders_guest ON orders(guest_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_orders_guest`);

    await queryRunner.query(`
      ALTER TABLE orders ADD COLUMN guest_phone VARCHAR(20)
    `);
    await queryRunner.query(`
      ALTER TABLE orders ADD COLUMN guest_name VARCHAR(255)
    `);

    await queryRunner.query(`
      UPDATE orders
      SET guest_phone = guests.phone, guest_name = guests.name
      FROM guests
      WHERE orders.guest_id = guests.id
    `);

    await queryRunner.query(`ALTER TABLE orders ALTER COLUMN guest_phone SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE orders ALTER COLUMN guest_name SET NOT NULL`);

    await queryRunner.query(`
      ALTER TABLE orders ADD CONSTRAINT orders_guest_phone_fkey
      FOREIGN KEY (guest_phone) REFERENCES guests(phone)
    `);
    await queryRunner.query(`CREATE INDEX idx_orders_phone ON orders(guest_phone)`);

    await queryRunner.query(`ALTER TABLE orders DROP COLUMN guest_id`);
    await queryRunner.query(`ALTER TABLE guests DROP COLUMN document`);
  }
}
