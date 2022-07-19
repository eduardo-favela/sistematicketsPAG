import { Request, Response } from 'express'
import db from '../database'

class EstadisticosController {

    public async getStatistics(req: Request, res: Response) {
        await db.query(`SELECT UEN, COUNT(*) AS cantidad,
        ROUND(((COUNT(*) / (select count(*) from tickets WHERE fecha BETWEEN ? AND ?)) * 100), 2) AS porcentaje
        FROM tickets
        INNER JOIN empleados ON tickets.empleados_idempleado = empleados.idempleado
        INNER JOIN uens ON empleados.UENS_idUEN = uens.idUEN
        WHERE fecha BETWEEN ? AND ?
        GROUP BY idUEN ORDER BY cantidad;`,[req.body.fecha1, req.body.fecha2, req.body.fecha1, req.body.fecha2], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
}

const estadisticosController = new EstadisticosController()
export default estadisticosController