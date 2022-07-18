import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public static developmentOnly = true 

  public async run () {
    // Write your database queries inside the run method

    const uniqueKey = 'name'

    await Category.updateOrCreateMany(uniqueKey, [
      {
        name: 'Açougue',
        observation: 'Carnes em Geral'
      },
      {
        name: 'Limpeza',
        observation: 'Produtos para limpeza em Geral'
      },
      {
        name: 'Higiene',
        observation: 'Produtos para cuidado pessoal'
      },
      {
        name: 'Hortifruti',
        observation: 'Frutas, legumes e frios'
      }
    ])
  }
}
