import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    const uniqueKey = 'name'

    await Role.updateOrCreateMany(uniqueKey, [
      {
        name: 'admin',
        description: 'Access all resource of the system'
      },
      {
        name: 'client',
        description: 'Access to shopping and product features only'
      },
      {
        name: 'employee',
        description: 'Access to sales resources only'
      }
    ])
  }
}
