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
    public async getDeptosSistemas(req: Request, res: Response) {
        await db.query(`SELECT * FROM departamentos_sistema;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }
    public async setServicio(req: Request, res: Response) {
        const servicioRes= await db.query(`SELECT * FROM servicios WHERE servicio = ?`, req.body.servicio)
        if(servicioRes.length>0){
            res.json(false)
        }
        else{
            await db.query(`INSERT INTO servicios SET ?;`, [req.body], function (err: any, result: any, fields: any) {
                if (err) throw err
                res.json(result)
            });
        }
    }
}

const serviciosController = new ServiciosController()
export default serviciosController