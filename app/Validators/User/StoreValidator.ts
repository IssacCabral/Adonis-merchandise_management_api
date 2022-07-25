import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../messagesCustom'

export default class StoreValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    name: schema.string({trim: true}, [
      rules.maxLength(50),
      rules.minLength(3),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)
    ]),
    email: schema.string({trim: true}, [
      rules.maxLength(50),
      rules.minLength(8),
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    cpf: schema.string({}, [
      rules.regex(/^\d{3}.\d{3}.\d{3}-\d{2}$/),
      rules.unique({table: 'users', column: 'cpf'})
    ]),
    
    urlProfilePic: schema.file({size: '2mb', extnames: ['jpg', 'png', 'jpeg']}, []), 

    password: schema.string({}, [rules.maxLength(50)]),
    zipCode: schema.string({}, [rules.regex(/^[0-9]{5}-[0-9]{3}$/)]),
    state: schema.string({trim: true}, [rules.maxLength(2)]),
    city: schema.string({trim: true}, [rules.maxLength(50)]),
    street: schema.string({trim: true}, [rules.maxLength(250)]),
    district: schema.string.optional({trim: true}, [rules.maxLength(250)]),
    number: schema.number.optional([rules.unsigned()]),
    complement: schema.string.optional({trim: true}, [rules.maxLength(250)]),

  })

}
