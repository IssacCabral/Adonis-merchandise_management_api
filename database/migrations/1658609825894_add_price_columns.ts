import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // 8 números antes do ponto e dois números depois do ponto
      table.decimal('price', 8, 2).defaultTo(0).unsigned().after('code').notNullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('price')
    })
  }
}
