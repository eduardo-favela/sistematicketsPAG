import { Router } from 'express'
import equiposController  from '../controllers/equiposController'

class EquiposRouter {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.post('/getEquipos', equiposController.getEquipos)
    }
}

const equiposRouter = new EquiposRouter()
export default equiposRouter.router