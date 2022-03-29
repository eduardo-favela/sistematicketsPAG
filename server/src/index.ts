import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import bodyParser from 'body-parser';
import loginRoutes from './routes/loginRoutes';
import ticketsRoutes from './routes/ticketsRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import serviciosRoutes from './routes/serviciosRoutes';
import equipoSistemas from './routes/equipoSistemas';
import equiposRoutes from './routes/equiposRoutes';

class Server {

    public app: Application

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }
    config(): void {
        this.app.set('port', process.env.PORT || 3005)
        this.app.use(morgan('dev'))
        this.app.use(cors())
        this.app.use(express.json({ limit: '50mb' }))
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }))
        this.app.use(bodyParser.json({ limit: '50mb' }))
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    }
    routes(): void {
        this.app.use('/api/login', loginRoutes)
        this.app.use('/api/tickets',ticketsRoutes)
        this.app.use('/api/usuarios',usuariosRoutes)
        this.app.use('/api/servicios',serviciosRoutes)
        this.app.use('/api/equipoSistemas',equipoSistemas)
        this.app.use('/api/equipos',equiposRoutes)
    }
    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'))
        })
    }
}

const server = new Server()
server.start()