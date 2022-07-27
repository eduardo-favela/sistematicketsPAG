import { Router } from 'express'
import estadisticosController from '../controllers/estadisticosController'

class EstadisticosRouter {
    public router: Router = Router()

    constructor() {
        this.config()
    }

    config(): void {
        this.router.post('/getStatistics', estadisticosController.getStatistics)
        this.router.post('/getStatsTipoServicio', estadisticosController.getStatsTipoServicio)
        this.router.post('/getStatsActividad', estadisticosController.getStatsActividad)
    }
}

const estadisticosRouter = new EstadisticosRouter()
export default estadisticosRouter.router