import { Router } from 'express'
import serviciosController  from '../controllers/serviciosController'

class ServiciosRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getServicios', serviciosController.getServicios)
        this.router.get('/getDeptosSistemas', serviciosController.getDeptosSistemas)
        this.router.post('/getTiposServicios', serviciosController.getTiposServicios)
        this.router.post('/setServicio', serviciosController.setServicio)
    }
}

const serviciosRoutes = new ServiciosRoutes()
export default serviciosRoutes.router