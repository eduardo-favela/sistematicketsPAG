import { Request, Response } from 'express'
import db from '../database'

class UsuariosController {

    public async getUsuarios(req: Request, res: Response) {
        await db.query(`SELECT idempleado, CONCAT(TRIM(nombre), ' ', TRIM(apellido_paterno), ' ', TRIM(apellido_materno)) as nombre, uens.uen, 
        puestos.puesto, departamentos.departamento 
        FROM sistematicketspag.empleados 
        inner join uens on empleados.UENS_idUEN = uens.idUEN
        inner join puestos on empleados.puestos_id_puesto = puestos.id_puesto
        inner join departamentos on empleados.departamentos_id_departamento = departamentos.id_departamento order by nombre`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getTiposUsuario(req: Request, res: Response) {
        await db.query(`SELECT id_tipos_usuarios as idtipousuario, tipo_usuario as tipousuario 
        FROM tipos_usuarios`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
}

const usuariosController = new UsuariosController()
export default usuariosController