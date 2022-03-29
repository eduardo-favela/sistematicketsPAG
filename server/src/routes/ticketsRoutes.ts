import { Router } from 'express'
import ticketsController  from '../controllers/ticketsController'

class TicketsRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getUsuarios', ticketsController.getUsuarios)
    }
}

const ticketsRoutes = new TicketsRoutes()
export default ticketsRoutes.router