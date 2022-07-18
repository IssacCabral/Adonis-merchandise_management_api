import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().unique()

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')

      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .notNullable()
        .onDelete('CASCADE')  
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
