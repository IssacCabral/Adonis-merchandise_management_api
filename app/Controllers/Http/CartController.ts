import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import StoreValidator from 'App/Validators/Cart/StoreValidator'
import UpdateValidator from 'App/Validators/Cart/UpdateValidator'

import Cart from 'App/Models/Cart'

export default class CartController {
  public async index({auth, response}: HttpContextContract) {
    const userAuthenticate = auth.user!.id

    let cartInfo = {
      itensQuantity: 0,
      totalPrice: 0
    }

    if (userAuthenticate) {
      try {
        const cartItems = await Cart.query()
          .where('user_id', userAuthenticate)
          .preload('user', (queryUser) => {
            queryUser.select('id', 'name', 'email')
          })
          .preload('product', (queryProduct) => {
            queryProduct.select('id', 'name', 'code', 'price')
          })
        
        cartItems.forEach(({quantity, product}, index) => {
          cartInfo.totalPrice += product.price * quantity
          cartInfo.itensQuantity = index + 1
        })  

        return response.ok({cartInfo, cartItems})
      } catch (error) {
        return response.notFound({message: 'Cart items not found', originalError: error.message})
      }
    } else {
      return response.unauthorized({ message: 'You need to be logged' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    await request.validate(StoreValidator)

    const bodyCart = request.only(['user_id', 'product_id', 'quantity'])

    bodyCart.user_id = auth.user?.id

    // verificar se o item já está no carrinho
    const hasProductInTheCart = await Cart.query()
      .where('user_id', bodyCart.user_id)
      .andWhere('product_id', bodyCart.product_id).first()

    if(hasProductInTheCart){
      return response.badRequest({message: 'This product is already in the cart'})
    }

    try {
      const cart = await Cart.create(bodyCart)

      return response.ok(cart)
    } catch (error) {
      return response.badGateway({ message: 'Erro in register item in the cart', originalError: error.message })
    }

  }

  public async show({ response, auth, params }: HttpContextContract) {
    const userAuthenticate = auth.user!.id
    const productId = params.id

    if (userAuthenticate) {
      try {
        const cartItem = await Cart.query()
          .where('uer_id', userAuthenticate)
          .andWhere('product_id', productId)
          .preload('user', (queryUser) => {
            queryUser.select('id', 'name', 'email')
          })
          .preload('product', (queryProduct) => {
            queryProduct.select('id', 'name', 'code', 'price')
          })
          .firstOrFail()
       

        return response.ok({priceItemTotal: (cartItem.product.price * cartItem.quantity) , cartItem})
      } catch (error) {
        return response.notFound({message: 'Cart item not found', originalError: error.message})
      }
    } else {
      return response.unauthorized({ message: 'You need to be logged' })
    }

  }

  public async update({request, auth, params, response}: HttpContextContract) {
    await request.validate(UpdateValidator)

    const userAuthenticate = auth.user!.id
    const productId = params.id
    const {addQtdItem, removeQtdItem} = request.all()

    if (userAuthenticate) {
      try {
        const cartItem = await Cart.query()
          .where('user_id', userAuthenticate)
          .andWhere('product_id', productId)
          .firstOrFail()
        
        if(addQtdItem){
          cartItem.quantity += 1 
        }else if(removeQtdItem){
          cartItem.quantity -= 1 
        }

        await cartItem.save()
        
        return response.ok(cartItem)
      } catch (error) {
        return response.notFound({message: 'Cart item not found', originalError: error.message})
      }
    } else {
      return response.unauthorized({ message: 'You need to be logged' })
    }
  
  }

  public async destroy({response, params, auth}: HttpContextContract) {
    const userAuthenticate = auth.user!.id
    const productId = params.id

    if (userAuthenticate) {
      try {
        const cartItem = await Cart.query()
          .where('user_id', userAuthenticate)
          .andWhere('product_id', productId)
          .firstOrFail()
       
        await cartItem.delete()

        return response.ok({message: 'Item removed successfully'})
      } catch (error) {
        return response.notFound({message: 'Cart item not found', originalError: error.message})
      }
    } else {
      return response.unauthorized({ message: 'You need to be logged' })
    }
  }
}
