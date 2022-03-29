import { Request, Response } from 'express'
import db from '../database'

class TicketsController {

    public async getUsuarios(req: Request, res: Response) {
        await db.query(`SELECT idempleado, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) as nombre, uens.uen, 
        puestos.puesto, departamentos.departamento 
        FROM sistematicketspag.empleados 
        inner join uens on empleados.UENS_idUEN = uens.idUEN
        inner join puestos on empleados.puestos_id_puesto = puestos.id_puesto
        inner join departamentos on empleados.departamentos_id_departamento = departamentos.id_departamento`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
}

const ticketsController = new TicketsController()
export default ticketsController