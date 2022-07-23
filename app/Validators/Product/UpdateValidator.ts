import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../messagesCustom'

export default class UpdateValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public refs = schema.refs({
    productSecureId: this.ctx.params.id,
  })

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [
      rules.maxLength(50),
      rules.minLength(3),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),

    code: schema.string.optional({ trim: true }, [
      rules.unique({ 
        table: 'products', 
        column: 'code',
        caseInsensitive: true,
        whereNot: {secure_id: this.refs.productSecureId} 
      }),
      rules.maxLength(250)
    ]),

    categories: schema.array
      .optional([rules.minLength(1)])
      .members(
        schema.string({trim: true}, [rules.exists({table: 'categories', column: 'name'})])
      )

  })

}
