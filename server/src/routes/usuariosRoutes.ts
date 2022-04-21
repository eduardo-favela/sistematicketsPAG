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
        this.router.get('/getUens', usuariosController.getUens)
        this.router.get('/getPuestos', usuariosController.getPuestos)
        this.router.get('/getDeptos', usuariosController.getDeptos)

        this.router.post('/setColaborador', usuariosController.setColaborador)

        this.router.post('/updateColaborador', usuariosController.updateColaborador)
        
        this.router.post('/disableColab', usuariosController.disableColab)
    }
}

const usuariosRoutes = new UsuariosRoutes()
export default usuariosRoutes.router