import Mail from '@ioc:Adonis/Addons/Mail'
import User from "App/Models/User";

export async function sendEmail(user: User, template: string): Promise<void>{
    await Mail.send((message) => {
        message.from('merchandise-management@email.com')
            .to(user.email)
            .subject('Welcome to merchandise management!')
            .htmlView(template, {user})
    })
}