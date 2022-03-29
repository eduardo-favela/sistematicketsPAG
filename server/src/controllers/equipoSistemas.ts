import { Request, Response } from 'express'
import db from '../database'

class EquipoSistemasController {

    public async getEquipoSistemas(req: Request, res: Response) {
        await db.query(`SELECT concat(nombre, ' ',apellido_paterno, ' ') as nombre, idempleado,
        departamentos_sistema_iddepartamento as depto
        FROM equipo_sistemas
        inner join empleados on empleados_idempleado=empleados.idempleado;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
}

const equipoSistemasController = new EquipoSistemasController()
export default equipoSistemasController