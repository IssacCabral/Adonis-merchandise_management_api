import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // dropando a coluna que faz referência ao cart
      table.dropForeign('cart_id').dropColumn('cart_id')

      table
        .integer('product_id')
        .references('id')
        .inTable('products')
        .notNullable()
        .onDelete('CASCADE')
        .unsigned()
        .after('user_id')

      table.decimal('price_paid', 8, 2).defaultTo(0).notNullable().unsigned().after('product_id')  
      table.integer('quantity').after('price_paid').defaultTo(1).unsigned().notNullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('cart_id')
        .references('id')
        .inTable('carts')
        .after('user_id')
        .notNullable()
        .onDelete('CASCADE')

      table.dropForeign('product_id').dropColumn('product_id')
      table.dropColumn('price_paid')
      table.dropColumn('quantity')
    })
  }
}
