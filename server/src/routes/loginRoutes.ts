import { Router } from 'express'
import loginController  from '../controllers/loginController'

class LoginRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.post('/iniciarsesion', loginController.login)
        this.router.post('/setUser', loginController.setUser)
        this.router.post('/updateUser', loginController.updateUser)
    }
}

const loginRoutes = new LoginRoutes()
export default loginRoutes.router