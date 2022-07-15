import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({response}: HttpContextContract) {
    response.status(200).json({message: 'success'})
  }

  public async store({request, response, logger, route}: HttpContextContract) {
    const {email} = request.only(['email'])
    const body = request.body()
    const all = request.all()

    // E agora quando fizermos a requisição teremos informação da máquina de quem fez
    // essa requisição
    logger.info('create of the user')

    // informações da rota
    console.log(route)

    response.json({email: email, body, all})
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
