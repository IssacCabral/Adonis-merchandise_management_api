import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import {compose} from '@ioc:Adonis/Core/Helpers'
import {Filterable} from '@ioc:Adonis/Addons/LucidFilter'
import CategoryFilter from './Filters/CategoryFilter'

export default class Category extends compose(BaseModel, Filterable) {
  public static table = 'categories'

  public static $filter = () => CategoryFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public observation?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
