import { Request, Response } from 'express'
import db from '../database'

class ServiciosController {

    public async getServicios(req: Request, res: Response) {
        await db.query(`SELECT * FROM servicios WHERE estatus = 1 ORDER BY servicio;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    //OBTENER TODOS LOS SERVICIOS PARA MOSTRARLOS EN LA TABLA PARA EDITARLOS
    public async getServiciosTable(req: Request, res: Response) {
        await db.query(`SELECT idservicios, servicio, depto, departamento, 
        estatus as estatusid, asignar_equipo as asignar_equipoid,
        CASE
            WHEN estatus = 1 THEN 'ACTIVO'
            WHEN estatus = 0 THEN 'INACTIVO'
        END AS estatus,
         CASE
            WHEN asignar_equipo = 0 THEN 'NO'
            WHEN asignar_equipo = 1 THEN 'SI'
        END AS asignar_equipo
        FROM servicios 
        INNER JOIN departamentos_sistema on servicios.depto=departamentos_sistema.iddepartamento;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    //OBTENER LOS TIPOS DE SERVICIO QUE NO TIENEN UNA RELACIÓN ACTIVA CON EL SERVICIO SLECCIONADO
    public async getTiposServicios(req: Request, res: Response) {
        await db.query(`SELECT * FROM tipos_servicio WHERE idtipos_servicio NOT IN (SELECT idtipos_servicio
            FROM tipos_servicio
            INNER JOIN servicio_has_tipo_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
            INNER JOIN servicios on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
            WHERE idservicios = ? and servicio_has_tipo_servicio.estatus = 1);`, req.body.idservicio, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    //OBTENER TODOS LOS TIPOS DE SERVICIOS PARA MOSTRARLOS EN LA TABLA PARA EDITARLOS
    public async getTiposServicioTable(req: Request, res: Response) {
        await db.query(`SELECT idtipos_servicio, tiposervicio, estatus AS estatusid,
        CASE
            WHEN estatus = 1 THEN 'ACTIVO'
            WHEN estatus = 0 THEN 'INACTIVO'
        END AS estatus
        FROM tipos_servicio ORDER BY tiposervicio;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    //OBTENER LOS TIPOS DE SERVICIO QUE TIENEN UNA RELACIÓN ACTIVA CON EL SERVICIO SELECCIONADO
    public async getTiposServicioAsignados(req: Request, res: Response) {
        await db.query(`SELECT idtipos_servicio, tiposervicio, idservicios as idServicio
        FROM tipos_servicio
        INNER JOIN servicio_has_tipo_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        INNER JOIN servicios on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        WHERE idservicios = ? and servicio_has_tipo_servicio.estatus = 1;`, req.body.idservicio, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    public async getDeptosSistemas(req: Request, res: Response) {
        await db.query(`SELECT * FROM departamentos_sistema;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    //REGISTRA EL SERVICIO INGRESADO, PERO PRIMERO VERIFICA SI YA EXISTE, PARA NO DUPLICARLO
    public async setServicio(req: Request, res: Response) {
        const servicioRes = await db.query(`SELECT * FROM servicios WHERE servicio = ?`, req.body.servicio)
        if (servicioRes.length > 0) {
            res.json(false)
        }
        else {
            await db.query(`INSERT INTO servicios SET ?;`, [req.body], function (err: any, result: any, fields: any) {
                if (err) throw err
                res.json(result)
            });
        }
    }

    public async updateServicio(req: Request, res: Response) {
        await db.query(`UPDATE servicios SET servicio = ?, asignar_equipo = ?, depto = ?, estatus = ? 
        WHERE idservicios = ?`, [req.body.servicio,req.body.asignar_equipoid,req.body.depto,req.body.estatusid,req.body.idservicios],
        function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(true)
        });
    }

    //REGISTRA EL TIPO DE SERVICIO INGRESADO, PERO PRIMERO VERIFICA SI YA EXISTE, PARA NO DUPLICARLO
    public async setTipoServicio(req: Request, res: Response) {
        const servicioRes = await db.query(`SELECT * FROM tipos_servicio WHERE tiposervicio = ?`, req.body.tipoServicio)
        if (servicioRes.length > 0) {
            res.json(false)
        }
        else {
            await db.query(`INSERT INTO tipos_servicio SET ?;`, [req.body], function (err: any, result: any, fields: any) {
                if (err) throw err
                res.json(result)
            });
        }
    }

    public async updateTipoServicio(req: Request, res: Response) {
        await db.query(`UPDATE tipos_servicio SET tiposervicio = ?, estatus = ?
        WHERE idtipos_servicio = ?`, [req.body.tiposervicio, req.body.estatus, req.body.idtipos_servicio],
        function(err: any, result: any, fields: any){
            if (err) throw err
            res.json(true)
        });
    }

    //REGISTRA LA RELACIÓN DE UN SERVICIO Y UN TIPO DE SERVICIO, PERO ANTES REVISA SI YA EXISTE Y SOLO LA ACTUALIZA PARA NO DUPLICARLA
    public async setServicioHTS(req: Request, res: Response) {
        for (let i = 0; i < req.body.length; i++) {
            let result = await db.query(`SELECT * FROM servicio_has_tipo_servicio 
           where shts_has_servicio = ? and shts_has_tipo_servicio = ?;`, [parseInt(req.body[i].idServicio), req.body[i].idtipos_servicio]);
            if (result.length > 0) {
                await db.query(`UPDATE servicio_has_tipo_servicio SET estatus = 1
               WHERE idservicio_has_tipo_servicio = ?`, result[0].idservicio_has_tipo_servicio);
            }
            else {
                await db.query(`INSERT INTO servicio_has_tipo_servicio SET 
                shts_has_servicio = ?, shts_has_tipo_servicio = ?, estatus = 1;`,
                    [parseInt(req.body[i].idServicio), req.body[i].idtipos_servicio]);
            }
        }
        res.json(true);
    }
    
    //DESHABILITA LA RELACIÓN DEL SERVICIO Y TIPO DE SERVICIO
    public async unsetServicioHTS(req: Request, res: Response) {
        console.log(req.body)
        for (let i = 0; i < req.body.length; i++) {
            await db.query(`UPDATE servicio_has_tipo_servicio SET estatus = 0
            WHERE shts_has_servicio = ? and shts_has_tipo_servicio = ?;`, [req.body[i].idServicio, req.body[i].idtipos_servicio])
        }
        res.json(true);
    }
}

const serviciosController = new ServiciosController()
export default serviciosController