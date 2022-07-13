import { Router } from 'express'
import equipoSistemasController  from '../controllers/equipoSistemas'

class EquipoSistemasRouter {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getEquipoSistemas', equipoSistemasController.getEquipoSistemas)
        this.router.post('/getEquipoSistemasFiltro', equipoSistemasController.getEquipoSistemasFiltro)
    }
}

const equipoSistemasRouter = new EquipoSistemasRouter()
export default equipoSistemasRouter.router