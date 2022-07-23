import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Category from 'App/Models/Category'

import StoreValidator from 'App/Validators/Category/StoreValidator'
import UpdateValidator from 'App/Validators/Category/UpdateValidator'

export default class CategoriesController {
  public async index({request, response}: HttpContextContract) {
    const {page, perPage, noPaginate, ...inputs} = request.qs()

    if(noPaginate){
      return await Category.query().filter(inputs)
    }

    try {
      const categories = await Category.query()
        .filter(inputs)
        .paginate(page || 1, perPage || 10)

      return response.ok(categories)
    } catch (error) {
      return response.badRequest({
        message: 'error in list categories',
        originalError: error.message,
      })
    }
  }

  public async store({request, response}: HttpContextContract) {
    await request.validate(StoreValidator)

    const body = request.only(['name', 'observation'])

    try{
      return await Category.create(body) 
    } catch(error){
      return response.badRequest({message: 'Error in create Category', originalError: error.message})
    }
  }

  public async show({response, params}: HttpContextContract) {
    const categoryId = params.id
    
    try{
      return await Category.findByOrFail('id', categoryId)
    } catch(error){
      return response.notFound({message: 'Category not found', originalError: error.message})
    }
  }

  public async update({request, response, params}: HttpContextContract) {
    await request.validate(UpdateValidator)

    const categoryId = params.id
    const body = request.only(['name', 'observation'])

    try{
      const categoryUpdated = await Category.findByOrFail('id', categoryId)
      
      await categoryUpdated.merge(body).save()

      return response.ok({categoryUpdated})
    } catch(error){
      return response.badRequest({message: 'Error in update Category', originalError: error.message})
    }
  }

  public async destroy({response, params}: HttpContextContract) {
    const categoryId = params.id
    
    try{
      const categoryFind =  await Category.findByOrFail('id', categoryId)

      await categoryFind.delete()

      return response.ok({message: 'Category successfully deleted'})
    } catch(error){
      return response.notFound({message: 'Category not found', originalError: error.message})
    }
  }

}
