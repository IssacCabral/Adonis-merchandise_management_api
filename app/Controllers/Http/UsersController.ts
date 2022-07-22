import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

import StoreValidator from 'App/Validators/User/StoreValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'

export default class UsersController {
  
  public async index({response}: HttpContextContract) {
    response.status(200).json({message: 'success'})
  }

  public async store({request, response}: HttpContextContract){
    await request.validate(StoreValidator)

    const bodyUser = request.only(['name', 'cpf', 'email', 'password'])
    const bodyAddress = request.only([
      'zipCode',
      'state',
      'city',
      'street',
      'district',
      'number',
      'complement'
    ])

    let user = new User()

    const trx = await Database.transaction()

    try{
      user.fill(bodyUser)

      user.useTransaction(trx)

      await user.save()

      const roleClient = await Role.findBy('name', 'client')

      if(roleClient) {
        await user.related('roles').attach([roleClient.id])
      }
    } catch(error){
      return response.badRequest({message: 'Error in create User', originalError: error.message})
    } 
    
    try{
      await user.related('addresses').create(bodyAddress)
    } catch(error){
      return response.badRequest({message: 'Error in create Address', originalError: error.message})
    }

    trx.commit()

    let userFind
    try {
      userFind = await User.query().where('id', user.id).preload('roles').preload('addresses')
    } catch (error) {
      return response.badRequest({message: 'Error in find User', originalError: error.message})
    }

    return response.ok({userFind})
  }

  public async show({response}: HttpContextContract) {
    response.ok({message: 'Mostra um usuário'})
  }

  public async update({auth, request, response, params}: HttpContextContract) {
    await request.validate(UpdateValidator)

    const userSecureId = params.id
    const bodyUser = request.only(['name', 'cpf', 'email', 'password'])
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

    let userUpdated = new User()

    const trx = await Database.transaction()

    try{
      userUpdated = await User.findByOrFail('secure_id', userSecureId)

      userUpdated.useTransaction(trx)

      const checkId = auth.user?.secure_id == userSecureId

      if(!checkId){
        throw new Error('You don/\'t have permissions to alter other user')
      }

      await userUpdated.merge(bodyUser).save()
     
    } catch(error){
      return response.badRequest({message: 'Error in update User', originalError: error.message})
    } 

    try{
      const addressesUpdated = await Address.findByOrFail('id', bodyAddress.addressId)

      userUpdated.useTransaction(trx)

      delete bodyAddress.addressId

      await addressesUpdated.merge(bodyAddress).save()
    } catch(error){
      return response.badRequest({message: 'Error in update Address', originalError: error.message})
    }

    trx.commit()

    let userFind
    try {
      userFind = await User.query().where('id', userUpdated.id).preload('roles').preload('addresses')
    } catch (error) {
      return response.badRequest({message: 'Error in find User', originalError: error.message})
    }

    return response.ok({userFind})
  }

  public async destroy({response}: HttpContextContract) {
    response.ok({message: 'Apaga um usuário'})
  }
}
