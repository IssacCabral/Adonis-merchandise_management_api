import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('password', 250).alter()  
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('password', 50).alter()  
    })
  }
}
