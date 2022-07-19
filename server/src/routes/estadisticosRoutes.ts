import { Router } from 'express'
import estadisticosController  from '../controllers/estadisticosController'

class EstadisticosRouter {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.post('/getStatistics', estadisticosController.getStatistics)
    }
}

const estadisticosRouter = new EstadisticosRouter()
export default estadisticosRouter.router