import { BaseTask } from 'adonis5-scheduler/build'
import Logger from '@ioc:Adonis/Core/Logger'

import dayjs from 'dayjs'
// plugin para setar qual localidade de horas que vamos trabalhar
import isLeapYear from 'dayjs/plugin/isLeapYear' 
import 'dayjs/locale/pt-br'

import Cart from 'App/Models/Cart'

export default class VerifyTimeItemInCart extends BaseTask {
	/**
	 * Qualquer valor
	 , separador de lista de valores
	 - faixa de valores
	 / valores de passo
	 */
	public static get schedule() {
		return '1 39 12 * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
		dayjs.extend(isLeapYear)
		dayjs.locale('pt-br')
		
		try{
			const itensCart = await Cart.all()

			await Promise.all(
				itensCart.map(async (item) => {
					const {created_at} = item.serialize()

					const newDateMoreThan1hour = dayjs(created_at).add(1, 'h').format()
					const currentDate = dayjs().format()

					if(newDateMoreThan1hour < currentDate){
						try{
							await item.delete()
							return Logger.info('Item removed')
						} catch(error){
							return Logger.error('Error in deleting item')
						}
					}

				})
			)
		} catch(error){

		}

  	}
}
