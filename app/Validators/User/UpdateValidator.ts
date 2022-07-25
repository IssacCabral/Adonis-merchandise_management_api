import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../messagesCustom'

export default class UpdateValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    id: this.ctx.params.id
  })

  public schema = schema.create({
    name: schema.string.optional({trim: true}, [
      rules.maxLength(50),
      rules.minLength(3),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)
    ]),
    email: schema.string.optional({trim: true}, [
      rules.maxLength(50),
      rules.minLength(8),
      rules.email(),
      rules.unique({ 
        table: 'users', 
        column: 'email',
        caseInsensitive: true,
        whereNot: {
          secure_id: this.refs.id
        } 
      }),
    ]),
    cpf: schema.string.optional({}, [
      rules.regex(/^\d{3}.\d{3}.\d{3}-\d{2}$/),
      rules.unique({
        table: 'users', 
        column: 'cpf',
        whereNot: {
          secure_id: this.refs.id
        } 
      })
    ]),

    urlProfilePic: schema.file.optional({size: '2mb', extnames: ['jpg', 'png', 'jpeg']}, []), 

    password: schema.string.optional({}, [rules.maxLength(50)]),
    addressId: schema.number.optional([rules.exists({table: 'addresses', column: 'id'})]),
    zipCode: schema.string.optional({}, [rules.regex(/^[0-9]{5}-[0-9]{3}$/)]),
    state: schema.string.optional({trim: true}, [rules.maxLength(2)]),
    city: schema.string.optional({trim: true}, [rules.maxLength(50)]),
    street: schema.string.optional({trim: true}, [rules.maxLength(250)]),
    district: schema.string.optional({trim: true}, [rules.maxLength(250)]),
    number: schema.number.optional([rules.unsigned()]),
    complement: schema.string.optional({trim: true}, [rules.maxLength(250)]),

  })

}
