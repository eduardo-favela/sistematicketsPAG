import { Router } from 'express'
import serviciosController from '../controllers/serviciosController'

class ServiciosRoutes {
    public router: Router = Router()

    constructor() {
        this.config()
    }

    config(): void {

        ////////////////////////////ACTIVIDADES////////////////////////////
        this.router.get('/getActividades', serviciosController.getActividades)
        this.router.get('/getActividadesHShtsTable', serviciosController.getActividadesHShtsTable)
        this.router.post('/setActividad', serviciosController.setActividad)
        this.router.post('/setActividadHShts', serviciosController.setActividadHShts)
        this.router.post('/unSetActividadHShts', serviciosController.unSetActividadHShts)
        this.router.post('/updateActividad', serviciosController.updateActividad)
        this.router.post('/updateActivShts', serviciosController.updateActivShts)
        this.router.post('/getShtsNoAsignados', serviciosController.getShtsNoAsignados)
        this.router.post('/getShtsAsignados', serviciosController.getShtsAsignados)

        this.router.post('/getActividadesForTicket', serviciosController.getActividadesForTicket)
        ///////////////////////////////////////////////////////////////////

        /////////////////////////////SERVICIOS/////////////////////////////
        this.router.get('/getServicios', serviciosController.getServicios)
        this.router.get('/getServiciosTable', serviciosController.getServiciosTable)
        this.router.post('/getServiciosDepto', serviciosController.getServiciosDepto)
        this.router.post('/setServicio', serviciosController.setServicio)
        this.router.post('/updateServicio', serviciosController.updateServicio)
        this.router.post('/setServicioHTS', serviciosController.setServicioHTS)
        this.router.post('/unsetTipoServicio', serviciosController.unsetServicioHTS)
        
        //////////////RUTAS PARA USO DE LA PANTALLA DE TICKETS//////////////
        this.router.post('/getTServicioForTicket', serviciosController.getTServicioForTicket)
        ///////////////////////////////////////////////////////////////////

        ////////////////////////TIPOS DE SERVICIO//////////////////////////
        this.router.get('/getDeptosSistemas', serviciosController.getDeptosSistemas)
        this.router.get('/getTiposServicioTable', serviciosController.getTiposServicioTable)
        this.router.post('/getTiposServicios', serviciosController.getTiposServicios)
        this.router.post('/setTipoServicio', serviciosController.setTipoServicio)
        this.router.post('/updateTipoServicio', serviciosController.updateTipoServicio)
        this.router.post('/getTiposServicioAsignados', serviciosController.getTiposServicioAsignados)
        ///////////////////////////////////////////////////////////////////
    }
}

const serviciosRoutes = new ServiciosRoutes()
export default serviciosRoutes.router