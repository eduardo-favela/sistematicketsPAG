import { Request, Response } from 'express'
import db from '../database'

class ServiciosController {

    public async getServicios(req: Request, res: Response) {
        await db.query(`SELECT * FROM servicios order by servicio;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getTiposServicios(req: Request, res: Response) {
        await db.query(`SELECT * FROM tipos_servicio where servicios_idservicios = ? ORDER by tiposervicio;`, req.body.servicio, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
}

const serviciosController = new ServiciosController()
export default serviciosController