import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

// rota para testar a conexão com o banco
Route.get('/test_db_connections', async ({response}: HttpContextContract) => {
  await Database.report().then(({health}) => {
    const {healthy, message} = health
    
    if(healthy) return response.ok({message})
    
    return response.status(500).json({message})
  })
})

// public routes
Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/users', 'UsersController.store')
}).prefix('v1/api')

// authenticate routes group
Route.group(() => {
  Route.resource('/users', 'UsersController').except(['store', 'index', 'destroy'])
})  
  .prefix('v1/api')
  .middleware(['auth', 'is:client'])

// Routes admin group  
Route.group(() => {
  Route.resource('/users', 'UsersController').only(['index', 'destroy'])
})  
  .prefix('v1/api')
  .middleware(['auth', 'is:admin'])