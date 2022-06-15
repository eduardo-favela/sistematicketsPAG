import { Router } from 'express'
import ticketsController  from '../controllers/ticketsController'

class TicketsRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getUsuarios', ticketsController.getUsuarios)
        this.router.get('/geEstatusTickets', ticketsController.geEstatusTickets)
        this.router.post('/getTicketsForTable', ticketsController.getTicketsForTable)
        this.router.post('/getTicketsOpen', ticketsController.getTicketsOpen)
        this.router.post('/setTicket', ticketsController.setTicket)
        this.router.post('/setCommentsFecha', ticketsController.setCommentsFecha)
        this.router.post('/setSeguimiento', ticketsController.setSeguimiento)
        this.router.post('/getSeguimientosTicket', ticketsController.getSeguimientosTicket)
        this.router.post('/ticketSolucionado', ticketsController.ticketSolucionado)
        this.router.post('/downloadExcelFile', ticketsController.downloadExcelFile)
    }
}

const ticketsRoutes = new TicketsRoutes()
export default ticketsRoutes.router