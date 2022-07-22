import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import Hash from '@ioc:Adonis/Core/Hash'

import {compose} from '@ioc:Adonis/Core/Helpers'
import {Filterable} from '@ioc:Adonis/Addons/LucidFilter'
import UserFilter from './Filters/UserFilter'

import {v4 as uuidv4} from 'uuid'
import Address from './Address'
import Purchase from './Purchase'
import Role from './Role'

export default class User extends compose(BaseModel, Filterable) {
  public static $filter = () => UserFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public secure_id: string

  // serializaAs: null, indica que quando eu retornar
  // um User, não retorna essa coluna
  @column({serializeAs: null})
  public rememberMeToken?: string

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public email: string

  @column({serializeAs: null}) // não retornar o password na resposta da request
  public password: string 

  @column.dateTime({ autoCreate: true }) 
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @hasMany(() => Purchase)
  public purchases: HasMany<typeof Purchase>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles'
  })
  public roles: ManyToMany<typeof Role>

  @beforeCreate()
  public static assignUuid(user: User){
    user.secure_id = uuidv4()
  }

  @beforeSave()
  public static async hashPassword(user: User){
    if(user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

}
