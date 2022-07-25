import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

// validators
import StoreValidator from 'App/Validators/User/StoreValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'
import AccessAllowValidator from 'App/Validators/User/AccessAllowValidator'

import { sendEmail } from 'App/Services/sendEmail'
import { sendImgToS3AWS } from 'App/Services/sendImgToS3AWS'

export default class UsersController {

  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate, ...inputs } = request.qs()

    if (noPaginate) {
      return await User.query()
        .preload('addresses')
        .preload('roles', (roleTable) => {
          roleTable.select('id', 'name')
        }).filter(inputs)
    }

    try {
      const users = await User.query()
        .preload('addresses')
        .preload('roles', (roleTable) => {
          roleTable.select('id', 'name')
        })
        .filter(inputs)
        .paginate(page || 1, perPage || 10)

      return response.ok(users)
    } catch (error) {
      return response.badRequest({ message: 'error in list users', originalError: error.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)

    const bodyUser = request.only(['name', 'cpf', 'email', 'password', 'urlProfilePic'])
    const bodyAddress = request.only([
      'zipCode',
      'state',
      'city',
      'street',
      'district',
      'number',
      'complement'
    ])

    const urlProfilePic = request.file('urlProfilePic')

    let url: string
    try {
      url = await sendImgToS3AWS(urlProfilePic, { name: bodyUser.name, cpf: bodyUser.cpf })
    } catch (error) {
      return response.badRequest({
        message: 'Error in upload image in S3 AWS Storage! to aqui no store',
        originalError: error.message
      })
    }

    let user = new User()

    const trx = await Database.transaction()

    try {
      bodyUser.urlProfilePic = url

      user.fill(bodyUser)

      user.useTransaction(trx)

      await user.save()

      const roleClient = await Role.findBy('name', 'client')

      if (roleClient) {
        await user.related('roles').attach([roleClient.id])
      }
    } catch (error) {
      return response.badRequest({ message: 'Error in create User', originalError: error.message })
    }

    try {
      await user.related('addresses').create(bodyAddress)
    } catch (error) {
      return response.badRequest({ message: 'Error in create Address', originalError: error.message })
    }

    // send email service
    try {
      await sendEmail(user, 'email/welcome')
    } catch (error) {
      return response.badRequest({ message: 'Error in send welcome email', originalError: error.message })
    }

    trx.commit()

    var userFind
    try {
      console.log(user.id)
      userFind = await User.query().where('id', user.id).preload('addresses').preload('roles')
      console.log(userFind)
    } catch (error) {
      return response.badRequest({ message: 'Error in find User', originalError: error.message })
    }

    return response.ok({ userFind })
  }

  public async show({ response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const searchUser = await User.query().where('secure_id', userSecureId).preload('roles').preload('addresses')

      return response.ok(searchUser)

    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
  }

  public async update({ auth, request, response, params }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const userSecureId = params.id
    const bodyUser = request.only(['name', 'cpf', 'email', 'password', 'urlProfilePic'])
    const bodyAddress = request.only([
      'addressId',
      'zipCode',
      'state',
      'city',
      'street',
      'district',
      'number',
      'complement'
    ])

    const urlProfilePic = request.file('urlProfilePic')


    let userUpdated = new User()

    const trx = await Database.transaction()

    try {
      userUpdated = await User.findByOrFail('secure_id', userSecureId)

      let url
      try {
        url = await sendImgToS3AWS(urlProfilePic, { name: userUpdated.name, cpf: userUpdated.cpf })
      } catch (error) {
        return response.badRequest({
          message: 'Error in upload image in S3 AWS Storage!',
          originalError: error.message
        })
      }

      bodyUser.urlProfilePic = url

      userUpdated.useTransaction(trx)

      const checkId = auth.user?.secure_id == userSecureId

      if (!checkId) {
        throw new Error('You don/\'t have permissions to alter other user')
      }

      await userUpdated.merge(bodyUser).save()

    } catch (error) {
      return response.badRequest({ message: 'Error in update User', originalError: error.message })
    }

    if (bodyAddress.addressId) {
      try {
        const addressesUpdated = await Address.findByOrFail('id', bodyAddress.addressId)

        userUpdated.useTransaction(trx)

        delete bodyAddress.addressId

        await addressesUpdated.merge(bodyAddress).save()
      } catch (error) {
        return response.badRequest({ message: 'Error in update Address', originalError: error.message })
      }
    }

    trx.commit()

    let userFind
    try {
      userFind = await User.query().where('id', userUpdated.id).preload('roles').preload('addresses')
    } catch (error) {
      return response.badRequest({ message: 'Error in find User', originalError: error.message })
    }

    return response.ok({ userFind })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const userFind = await User.findByOrFail('secure_id', userSecureId)

      await userFind.delete()

      return response.ok({ message: 'User successfully deleted' })
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
  }

  public async AccessAllow({ request, response }: HttpContextContract) {
    await request.validate(AccessAllowValidator)

    const { user_id, roles } = request.all()

    try {
      const userAllow = await User.findByOrFail('id', user_id)

      let roleIds: number[] = []
      await Promise.all(
        roles.map(async (roleName) => {
          const hasRole = await Role.findBy('name', roleName)
          if (hasRole) roleIds.push(hasRole.id)
        })
      )

      await userAllow.related('roles').sync(roleIds)
    } catch (error) {
      return response.badRequest({ message: 'Error in access allow', originalError: error.message })
    }

    try {
      return User.query().where('id', user_id).preload('roles').preload('addresses').firstOrFail()
    } catch (error) {
      return response.badRequest({ message: 'Error in find User', originalError: error.message })
    }

  }
}
