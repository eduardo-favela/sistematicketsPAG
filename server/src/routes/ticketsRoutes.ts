import { Router } from 'express'
import ticketsController  from '../controllers/ticketsController'

class TicketsRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getUsuarios', ticketsController.getUsuarios)
        this.router.get('/getTicketsForTable', ticketsController.getTicketsForTable)
        this.router.post('/setTicket', ticketsController.setTicket)
    }
}

const ticketsRoutes = new TicketsRoutes()
export default ticketsRoutes.router