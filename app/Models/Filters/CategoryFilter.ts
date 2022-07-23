import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'

export default class CategoryFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Category, Category>

  name(value: string){
    this.$query.where('name', 'LIKE', `%${value}%`)
  }
}
