import { Router } from 'express'
import usuariosController  from '../controllers/usuariosController'

class UsuariosRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getUsuarios', usuariosController.getUsuarios)
        this.router.get('/getTiposUsuario', usuariosController.getTiposUsuario)
    }
}

const usuariosRoutes = new UsuariosRoutes()
export default usuariosRoutes.router