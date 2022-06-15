import { Request, Response } from 'express'
import db from '../database'

class EquiposController {

    public async getEquipos(req: Request, res: Response) {

        await db.query(`SELECT idequipo, equipo, tipo.tipo_equipo as tipoEquipo, no_serie
        FROM empleados_has_equipos
        inner join empleados on empleados_has_equipos.empleados_idempleado=empleados.idempleado
        inner join equipos on empleados_has_equipos.equipos_idequipo=equipos.idequipo
        inner join tipo on equipos.tipo_idtipo=tipo.idtipo
        where empleados_idempleado = ? and empleados_has_equipos.empleados_has_estatus = 'ACTIVO';`, req.body.idusuario, function (err: any, result: any, fields: any) {
            if (err) throw console.error(err)
            res.json(result)
        })
    }

    public async getEquiposFormngEq(req: Request, res: Response) {
        let result = {
            asignados: null,
            noasignados: null
        }
        result.asignados = await db.query(`SELECT id_empleados_has_equipos as id_c_has_e, idequipo, equipo, tipo.tipo_equipo as tipo, no_serie
        FROM empleados_has_equipos
        inner join empleados on empleados_has_equipos.empleados_idempleado=empleados.idempleado
        inner join equipos on empleados_has_equipos.equipos_idequipo=equipos.idequipo
        inner join tipo on equipos.tipo_idtipo=tipo.idtipo
        where empleados_idempleado = ? and empleados_has_equipos.empleados_has_estatus = 'ACTIVO';`, req.body.idusuario)

        result.noasignados = await db.query(`SELECT idequipo, equipo, tipo.tipo_equipo as tipo, no_serie
        FROM equipos
        inner join tipo on equipos.tipo_idtipo=tipo.idtipo
        where equipos.idequipo not in (SELECT eqss.idequipo
        FROM empleados_has_equipos
        inner join empleados on empleados_has_equipos.empleados_idempleado=empleados.idempleado
        inner join equipos as eqss on empleados_has_equipos.equipos_idequipo=eqss.idequipo
        inner join tipo on eqss.tipo_idtipo=tipo.idtipo
        where empleados_idempleado = ? and empleados_has_equipos.empleados_has_estatus = 'ACTIVO');`, req.body.idusuario)

        res.json(result)
    }

    public async asignarEquipo(req: Request, res: Response) {
        let asignacion = await db.query(`SELECT * FROM empleados_has_equipos 
        WHERE empleados_idempleado = ? AND equipos_idequipo = ? AND empleados_has_estatus = 'INACTIVO';`, [req.body.idempleado, req.body.idequipo])
        /* console.log(asignacion, req.body) */
        if (asignacion.length > 0) {
            await db.query(`UPDATE empleados_has_equipos SET empleados_has_estatus = 'ACTIVO' 
            WHERE id_empleados_has_equipos = ?`, [asignacion[0].id_empleados_has_equipos],
                function (err: any, result: any, fields: any) {
                    if (err) throw err
                    res.json(true)
                })
        }
        else {
            await db.query(`INSERT INTO empleados_has_equipos SET empleados_idempleado = ?, equipos_idequipo = ?, 
            empleados_has_equipos_responsiva = ?, empleados_has_fecha_asign = ?, empleados_has_estatus = 'ACTIVO';`,
                [req.body.idempleado, req.body.idequipo, req.body.responsiva, req.body.fechaAsign], function (err: any, result: any, fields: any) {
                    if (err) throw err
                    res.json(true)
                })
        }
    }

    public async desAsignarEquipo(req: Request, res: Response) {
        await db.query(`UPDATE empleados_has_equipos SET empleados_has_estatus = 'INACTIVO', empleados_has_fecha_desasign = ?
        WHERE id_empleados_has_equipos = ?`, [req.body.fecha_desasign, req.body.id_c_has_e],
            function (err: any, result: any, fields: any) {
                if (err) throw err
                res.json(true)
            })
    }

    public async desasignarEquipo(req: Request, res: Response) {
        await db.query(`SELECT * FROM tipo ORDER BY tipo_equipo;`, req.body.idusuario, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getTiposEquipos(req: Request, res: Response) {
        await db.query(`SELECT * FROM tipo ORDER BY tipo_equipo;`, req.body.idusuario, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getMarcasEquipos(req: Request, res: Response) {
        await db.query(`SELECT * FROM marcas ORDER BY marca;`, req.body.idusuario, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async setEquipo(req: Request, res: Response) {
        await db.query(`INSERT INTO equipos SET equipo = ?, propiedad = ?, no_serie = ?, descripcion = ?,
         estatus = 'ACTIVO', tipo_idtipo = ?, marcas_id_marca = ?;`, [req.body.equipo, req.body.propiedad, req.body.no_serie,
        req.body.descripcion, req.body.tipo, req.body.marca], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async updateEquipo(req: Request, res: Response) {
        await db.query(`UPDATE equipos SET equipo = ?, propiedad = ?, no_serie = ?, descripcion = ?,
        tipo_idtipo = ?, marcas_id_marca = ? WHERE idequipo = ?;`, [req.body.equipo, req.body.propiedad, req.body.no_serie,
        req.body.descripcion, req.body.tipo, req.body.marca, req.body.idequipo], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async deleteEquipo(req: Request, res: Response) {
        await db.query(`UPDATE equipos SET estatus = 'STOCK' WHERE idequipo = ?;`, [req.body.id],
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