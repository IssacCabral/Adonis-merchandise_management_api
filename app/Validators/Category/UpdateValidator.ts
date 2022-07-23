import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    categoryId: this.ctx.params.id
  })

  public schema = schema.create({
    name: schema.string.optional({trim: true}, [
      rules.maxLength(50),
      rules.minLength(3),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),

      rules.unique({
        table: 'categories',
        column: 'name',
        caseInsensitive: true,
        whereNot: {id: this.refs.categoryId}
      })
    ]),
    
    observation: schema.string.optional({trim: true}, [])
  })


  public messages: CustomMessages = {}
}
