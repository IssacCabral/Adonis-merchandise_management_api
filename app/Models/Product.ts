import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

import {compose} from '@ioc:Adonis/Core/Helpers'
import {Filterable} from '@ioc:Adonis/Addons/LucidFilter'
import ProductFilter from './Filters/ProductFilter'

import {v4 as uuidv4} from 'uuid'
import Category from './Category'

export default class Product extends compose(BaseModel, Filterable) {
  public static $filter = () => ProductFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Category, {
    pivotTable: 'products_categories'
  })
  public categories: ManyToMany<typeof Category>

  @beforeCreate()
  public static assignUuid(product: Product){
    product.secureId = uuidv4()
  }
}
