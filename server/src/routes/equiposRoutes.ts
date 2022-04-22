import { Router } from 'express'
import equiposController  from '../controllers/equiposController'

class EquiposRouter {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.post('/getEquipos', equiposController.getEquipos)
        this.router.get('/getTiposEquipos', equiposController.getTiposEquipos)
        this.router.get('/getMarcasEquipos', equiposController.getMarcasEquipos)
        this.router.get('/getEquiposTable', equiposController.getEquiposTable)
        this.router.post('/setEquipo', equiposController.setEquipo)
        this.router.post('/updateEquipo', equiposController.updateEquipo)
        this.router.post('/deleteEquipo', equiposController.deleteEquipo)
    }
}

const equiposRouter = new EquiposRouter()
export default equiposRouter.router