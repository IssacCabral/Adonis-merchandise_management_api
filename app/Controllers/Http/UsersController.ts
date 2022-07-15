import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({response}: HttpContextContract) {
    response.ok({message: 'Lista todos os usuários'})
  }

  public async store({response}: HttpContextContract) {
    response.ok({message: 'Cadastra um usuário'})
  }

  public async show({response}: HttpContextContract) {
    response.ok({message: 'Mostra um usuário'})
  }

  public async update({response}: HttpContextContract) {
    response.ok({message: 'Altera um usuário'})
  }

  public async destroy({response}: HttpContextContract) {
    response.ok({message: 'Apaga um usuário'})
  }
}
