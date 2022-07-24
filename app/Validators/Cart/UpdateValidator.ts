import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MessagesCustom from '../messagesCustom'

export default class UpdateValidator extends MessagesCustom{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    addQtdItem: schema.boolean.optional([]), 
    removeQtdItem: schema.boolean.optional([rules.requiredIfNotExists('addQtdItem')])
  })
}
