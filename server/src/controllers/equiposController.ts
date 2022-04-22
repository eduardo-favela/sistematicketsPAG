import { Request, Response } from 'express'
import db from '../database'

class EquiposController {

    public async getEquipos(req: Request, res: Response) {
        await db.query(`SELECT idequipo, equipo, tipo.tipo_equipo as tipoEquipo, no_serie
        FROM empleados_has_equipos
        inner join empleados on empleados_has_equipos.empleados_idempleado=empleados.idempleado
        inner join equipos on empleados_has_equipos.equipos_idequipo=equipos.idequipo
        inner join tipo on equipos.tipo_idtipo=tipo.idtipo
        where empleados_idempleado = ? and empleados_has_equipos.empleados_has_estatus = 'ACTIVO';`,req.body.idusuario, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getTiposEquipos(req: Request, res: Response) {
        await db.query(`SELECT * FROM tipo ORDER BY tipo_equipo;`,req.body.idusuario, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getMarcasEquipos(req: Request, res: Response) {
        await db.query(`SELECT * FROM marcas ORDER BY marca;`,req.body.idusuario, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async setEquipo(req: Request, res: Response) {
        await db.query(`INSERT INTO equipos SET equipo = ?, propiedad = ?, no_serie = ?, descripcion = ?,
         estatus = 'ACTIVO', tipo_idtipo = ?, marcas_id_marca = ?;`,[req.body.equipo, req.body.propiedad,req.body.no_serie,
        req.body.descripcion, req.body.tipo, req.body.marca], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async updateEquipo(req: Request, res: Response) {
        await db.query(`UPDATE equipos SET equipo = ?, propiedad = ?, no_serie = ?, descripcion = ?,
        tipo_idtipo = ?, marcas_id_marca = ? WHERE idequipo = ?;`,[req.body.equipo, req.body.propiedad,req.body.no_serie,
        req.body.descripcion, req.body.tipo, req.body.marca, req.body.idequipo], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async deleteEquipo(req: Request, res: Response) {
        await db.query(`UPDATE equipos SET estatus = 'STOCK' WHERE idequipo = ?;`,[req.body.id],
         function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getEquiposTable(req: Request, res: Response) {
        await db.query(`SELECT idequipo, equipo, propiedad, no_serie, descripcion, estatus, tipo_equipo AS tipo, marca
        FROM equipos
        INNER JOIN tipo ON equipos.tipo_idtipo = tipo.idtipo
        INNER JOIN marcas ON equipos.marcas_id_marca = marcas.id_marca
        WHERE estatus = 'ACTIVO';`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
}

const equiposController = new EquiposController()
export default equiposController