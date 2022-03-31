import { Router } from 'express'
import serviciosController  from '../controllers/serviciosController'

class ServiciosRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getServicios', serviciosController.getServicios)
        this.router.get('/getServiciosTable', serviciosController.getServiciosTable)
        this.router.get('/getDeptosSistemas', serviciosController.getDeptosSistemas)
        this.router.get('/getTiposServicioTable', serviciosController.getTiposServicioTable)
        this.router.post('/getTiposServicios', serviciosController.getTiposServicios)
        this.router.post('/setServicio', serviciosController.setServicio)
        this.router.post('/updateServicio', serviciosController.updateServicio)
        this.router.post('/setTipoServicio', serviciosController.setTipoServicio)
        this.router.post('/updateTipoServicio', serviciosController.updateTipoServicio)
        this.router.post('/setServicioHTS', serviciosController.setServicioHTS)
        this.router.post('/unsetTipoServicio', serviciosController.unsetServicioHTS)
        this.router.post('/getTiposServicioAsignados', serviciosController.getTiposServicioAsignados)
    }
}

const serviciosRoutes = new ServiciosRoutes()
export default serviciosRoutes.router