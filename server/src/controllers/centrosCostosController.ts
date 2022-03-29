import { Request, Response } from 'express'
import db from '../database'

class CentrosCostosController {
    public async todos(req: Request, res: Response){
        await db.query(`select id,concat(id, ', ', trim(descripcion)) as descripcion from puntos_venta_kiosko where descripcion like ('%HOME%')`, function(err: any, result: any, fields: any){
            if(err) throw err
            res.json(result)
        })
    }
    public async todosvending(req: Request, res: Response){
        await db.query(`select idtienda,concat(idtienda, ', ', trim(tienda)) as descripcion, concat(municipio, ', ',estado)as plaza 
        from puntos_venta_vending`, function(err: any, result: any, fields: any){
            if(err) throw err
            res.json(result)
        })
    }
    public async maquinasenpv(req: Request, res: Response){
        await db.query(`select * from tipomaq order by idtipomaq;`,req.body.sucursal, function(err: any, result: any, fields: any){
            if(err) throw err
            res.json(result)
        })
    }
    public async getsucursales(req: Request, res: Response){
        await db.query(`select estado from puntos_venta_vending group by estado order by estado;`,req.body.sucursal, function(err: any, result: any, fields: any){
            if(err) throw err
            res.json(result)
        })
    }
}

const centrosCostosController = new CentrosCostosController()
export default centrosCostosController