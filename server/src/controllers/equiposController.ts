import { Request, Response } from 'express'
import db from '../database'

class EquiposController {

    public async getEquipos(req: Request, res: Response) {
        await db.query(`SELECT idequipo, equipo, tipo.tipo_equipo as tipoEquipo, no_serie
        FROM empleados_has_equipos
        inner join empleados on empleados_has_equipos.empleados_idempleado=empleados.idempleado
        inner join equipos on empleados_has_equipos.equipos_idequipo=equipos.idequipo
        inner join tipo on equipos.tipo_idtipo=tipo.idtipo
        where empleados_idempleado = ?;`,req.body.idusuario, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
}

const equiposController = new EquiposController()
export default equiposController