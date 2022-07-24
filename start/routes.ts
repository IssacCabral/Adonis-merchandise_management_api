import Route from '@ioc:Adonis/Core/Route'

// public routes
Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/users', 'UsersController.store')
}).prefix('v1/api')

// Client routes
Route.group(() => {
  Route.resource('/users', 'UsersController').except(['store', 'index', 'destroy'])
  Route.resource('/products', 'ProductsController').except(['store', 'destroy'])
  Route.resource('/cart', 'CartController').apiOnly()
})  
  .prefix('v1/api')
  .middleware(['auth', 'is:client'])

// Employee routes
Route.group(() => {
  Route.resource('products', 'ProductsController').only(['store', 'destroy'])
  Route.resource('categories', 'CategoriesController').apiOnly()
})
  .prefix('v1/api')
  .middleware(['auth', 'is:employee'])

// Admin routes  
Route.group(() => {
  Route.resource('/users', 'UsersController').only(['index', 'destroy'])
  Route.post('/users/access_allow', 'UsersController.AccessAllow')
})  
  .prefix('v1/api')
  .middleware(['auth', 'is:admin'])