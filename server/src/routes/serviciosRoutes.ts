import { Router } from 'express'
import serviciosController  from '../controllers/serviciosController'

class ServiciosRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getServicios', serviciosController.getServicios)
        this.router.post('/getTiposServicios', serviciosController.getTiposServicios)
    }
}

const serviciosRoutes = new ServiciosRoutes()
export default serviciosRoutes.router