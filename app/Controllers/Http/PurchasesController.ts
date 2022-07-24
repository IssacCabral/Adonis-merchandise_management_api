import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import StoreValidator from 'App/Validators/Purchase/StoreValidator'

import Cart from 'App/Models/Cart'
import Purchase from 'App/Models/Purchase'

export default class PurchasesController {
  public async index({auth, response}: HttpContextContract) {
    const userAuthenticateId = auth.user!.id

    try{
      const purchaseItems = await Purchase.query()
        .where('user_id', userAuthenticateId)
        .preload('user', (queryUser) => queryUser.select('id', 'name', 'email'))
        .preload('product', (queryProduct) => queryProduct.select('id', 'name', 'code', 'price'))

      return response.ok(purchaseItems)  
    } catch(error){
      return response.notFound({message: 'Purchase items not found', originalError: error.message})
    }
  }

  public async store({request, response, auth}: HttpContextContract) {
    await request.validate(StoreValidator)

    const bodyCart = request.only(['cart_id', 'user_id'])

    bodyCart.user_id = auth.user?.id

    // Find item in Cart
    let cartItem
    try{
      cartItem = await Cart.query()
        .where('id', bodyCart.cart_id)
        .andWhere('user_id', bodyCart.user_id)
        .preload('product', (queryProduct) => {queryProduct.select('id', 'name', 'code', 'price')})
        .firstOrFail()
      
        
    } catch(error){
      return response.notFound({message: 'Item cart not found',originalError: error.message})
    }

    const trx = await Database.transaction()

    // Add in purchases
    let purchaseItem = new Purchase()
    try{
      const cartItemJSON = cartItem.serialize()

      const bodyPurchase = {
        userId: cartItemJSON.user_id,
        productId: cartItemJSON.product_id,
        pricePaid: cartItemJSON.product.price * cartItemJSON.quantity,
        quantity: cartItemJSON.quantity
      }

      purchaseItem.fill(bodyPurchase)
      purchaseItem.useTransaction(trx)

      await purchaseItem.save()
    } catch(error){
      return response.badRequest({
        message: 'Error in add purchase',originalError: error.message })
    }

    try{
      await cartItem.delete()
    } catch(error){
      return response.badRequest({message: 'Error in remove item from the cart',originalError: error.message})
    }

    await trx.commit()

    return response.ok(purchaseItem)

  }

  public async show({params, response, auth}: HttpContextContract) {
    const purchaseId = params.id
    const userAuthenticateId = auth.user!.id

    try{
      const purchaseItem = await Purchase.query()
        .where('user_id', userAuthenticateId)
        .andWhere('id', purchaseId)
        .preload('user', (queryUser) => queryUser.select('id', 'name', 'email'))
        .preload('product', (queryProduct) => queryProduct.select('id', 'name', 'code', 'price'))
        .firstOrFail()

      return response.ok(purchaseItem)  
    } catch(error){
      return response.notFound({message: 'Purchase item not found', originalError: error.message})
    }

  }

}
