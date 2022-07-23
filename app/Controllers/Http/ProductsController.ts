import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

import Product from 'App/Models/Product'

import StoreValidator from 'App/Validators/Product/StoreValidator'
import UpdateValidator from 'App/Validators/Product/UpdateValidator'

export default class ProductsController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate, ...inputs } = request.qs()

    if (noPaginate) {
      return await Product.query().preload('categories').filter(inputs)
    }

    try {
      const products = await Product.query()
        .preload('categories')
        .filter(inputs)
        .paginate(page || 1, perPage || 10)

      return response.ok(products)
    } catch (error) {
      return response.badRequest({
        message: 'error in list products',
        originalError: error.message,
      })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator)

    const body = request.only(['name', 'code'])
    const {categories} = request.all()

    let productCreated = new Product()

    const trx = await Database.transaction()

    try {
      productCreated.fill(body)

      productCreated.useTransaction(trx)

      await productCreated.save()

      await Promise.all(
        categories.map(async (categoryName) => {
          const hasCategory = await Category.findBy('name', categoryName)
          if(hasCategory) await productCreated.related('categories').attach([hasCategory.id])
        })
      )
    } catch (error) {
      return response.badRequest({ message: 'Error in create Product', originalError: error.message })
    }

    trx.commit()

    try{
      const productFind = await Product.query().where('id', productCreated.id).preload('categories')
      return response.ok({productFind})
    } catch(error){
      return response.badRequest({message: 'Error in find Product', originalError: error.message})
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const productSecureId = params.id

    try {
      return await Product.query()
        .where('secure_id', productSecureId)
        .preload('categories')
        .firstOrFail()

    } catch (error) {
      return response.notFound({ message: 'Product not found', originalError: error.message })
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const productSecureId = params.id
    const bodyProduct = request.only(['name', 'code'])
    const {categories} = request.all()

    let productUpdated = new Product()

    const trx = await Database.transaction()

    try {
      productUpdated = await Product.findByOrFail('secure_id', productSecureId)

      productUpdated.useTransaction(trx)

      await productUpdated.merge(bodyProduct).save()

      let categoryIds: number[] = []
      await Promise.all(
        categories.map(async (categoryName) => {
          const hasCategory = await Category.findBy('name', categoryName)
          if(hasCategory) categoryIds.push(hasCategory.id)
        })
      )
      
      /**com esse syn queremos remover da tabela pivô tas as categorias que esse produto
       * fazia relacionamento e adicionar as novas categorias */
      await productUpdated.related('categories').sync(categoryIds)
      await productUpdated.merge(bodyProduct).save()
    } catch (error) {
      return response.badRequest({ message: 'Error in update Product', originalError: error.message })
    }

    trx.commit()

    try{
      const productFind = await Product.query().where('id', productUpdated.id).preload('categories')
      return response.ok({productFind})
    } catch(error){
      return response.badRequest({message: 'Error in find Product', originalError: error.message})
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const productSecureId = params.id

    try {
      const product = await Product.findByOrFail('secure_id', productSecureId)

      await product.delete()

      return response.ok({ message: 'Product successfully deleted' })
    } catch (error) {
      return response.notFound({ message: 'Product not found', originalError: error.message })
    }
  }
}
