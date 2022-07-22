import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>

  name(value: string){
    this.$query.where('name', 'LIKE', `%${value}%`)
  }

  createdAt(value: string){
    this.$query.where('created_at', 'LIKE', `%${value}%`)
  }

  // Ambos? city e state são relacionamentos de user com address
  city(value: string){
    // quero pegar city quando ele tiver relacionamento  com address
    this.$query.whereHas('addresses', (AddressModel) => {
      AddressModel.where('city', 'LIKE', `%${value}%`)
    })
  }

  state(value: string){
    // quero pegar state quando ele tiver relacionamento  com address
    this.$query.whereHas('addresses', (AddressModel) => {
      AddressModel.where('state', 'LIKE', `%${value}%`)
    })
  }
}
