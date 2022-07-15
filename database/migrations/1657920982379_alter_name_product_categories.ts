import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'alter_name_product_categories'

  public async up () {
    this.schema.renameTable('product_categories', 'products_categories')
  }

  public async down () {
    this.schema.renameTable('products_categories', 'product_categories')
  }
}
