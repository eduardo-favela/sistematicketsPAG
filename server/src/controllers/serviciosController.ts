import { Request, Response } from 'express'
import db from '../database'

class ServiciosController {

    public async getServicios(req: Request, res: Response) {
        await db.query(`SELECT * FROM servicios WHERE estatus = 1;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    public async getServiciosDepto(req: Request, res: Response) {

        let condition = ''

        if (req.body.depto != 4) {
            if (req.body.depto == 1 || req.body.depto == 2 || req.body.depto == 3) {
                condition = 'AND depto = ' + req.body.depto
            }
            else if (req.body.depto == 5) {
                condition = 'AND depto = 2'
            }
            else if(req.body.depto == 6){
                condition = 'AND depto = 1'
            }
        }
        await db.query(`SELECT * FROM servicios WHERE estatus = 1 ${condition};`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    public async getActividades(req: Request, res: Response) {
        await db.query(`SELECT * FROM actividades ORDER BY actividad;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    //OBTENER LAS RELACIONES ENTRE SERVICIOS Y TIPOS DE SERVICIO QUE NO ESTÉN RELACIONADAS CON LAS ACTIVIDADES
    public async getShtsNoAsignados(req: Request, res: Response) {
        await db.query(`SELECT idservicio_has_tipo_servicio as idshts, servicio, tipos_servicio.tiposervicio
        FROM servicio_has_tipo_servicio
        INNER JOIN servicios  on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE servicio_has_tipo_servicio.estatus=1
        AND servicio_has_tipo_servicio.idservicio_has_tipo_servicio NOT IN
        (SELECT ahs_has_servicio
        FROM actividad_has_servicios
        WHERE ahs_has_actividad = ? AND actividad_has_servicios.estatus = 1);`, req.body.id_actividad, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        });
    }

    //OBTENER LAS RELACIONES ENTRE SERVICIOS Y TIPOS DE SERVICIO QUE ESTÁN RELACIONADAS CON LAS ACTIVIDADES
    public async getShtsAsignados(req: Request, res: Response) {
        await db.query(`SELECT ahs_has_actividad AS id_actividad, servicio_has_tipo_servicio.idservicio_has_tipo_servicio AS idshts,
        servicios.servicio, tipos_servicio.tiposervicio,
        CONCAT(SUBSTRING_INDEX(tiempo, '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX(tiempo, '.', -1)*60),2),'.',-1)) AS displayTime
        FROM actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad=actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio=servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios  on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE ahs_has_actividad = ? AND actividad_has_servicios.estatus = 1;`, req.body.id_actividad, function (err: any, result: any, fields: any) {
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
            FROM servicio_has_tipo_servicio
            INNER JOIN tipos_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
            WHERE shts_has_servicio = ? and servicio_has_tipo_servicio.estatus = 1);`, req.body.idservicio, function (err: any, result: any, fields: any) {
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
        FROM tipos_servicio;`, function (err: any, result: any, fields: any) {
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
        WHERE idservicios = ?`, [req.body.servicio, req.body.asignar_equipoid, req.body.depto, req.body.estatusid, req.body.idservicios],
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
            function (err: any, result: any, fields: any) {
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
        for (let i = 0; i < req.body.length; i++) {
            await db.query(`UPDATE servicio_has_tipo_servicio SET estatus = 0
            WHERE shts_has_servicio = ? and shts_has_tipo_servicio = ?;`, [req.body[i].idServicio, req.body[i].idtipos_servicio])
        }
        res.json(true);
    }

    public async setActividad(req: Request, res: Response) {
        const actividadRes = await db.query(`SELECT * FROM actividades WHERE actividad = ?`, req.body.actividad)
        if (actividadRes.length > 0) {
            res.json(false)
        }
        else {
            await db.query(`INSERT INTO actividades SET ?;`, [req.body], function (err: any, result: any, fields: any) {
                if (err) throw err
                res.json(true)
            });
        }
    }

    public async updateActividad(req: Request, res: Response) {
        await db.query(`UPDATE actividades SET actividad = ?  WHERE id_actividad = ?;`, [req.body.actividad, req.body.id_actividad])
        res.json(true)
    }

    public async updateActivShts(req: Request, res: Response) {
        await db.query(`UPDATE actividad_has_servicios 
        SET tiempo = ?  WHERE id_actividad_has_servicios = ?;`, [req.body.tiempo, req.body.ahshts])
        res.json(true)
    }

    public async setActividadHShts(req: Request, res: Response) {
        for (let i = 0; i < req.body.length; i++) {
            let result = await db.query(`SELECT * FROM actividad_has_servicios 
            WHERE ahs_has_actividad = ? AND ahs_has_servicio = ?;`,
                [req.body[i].id_actividad, req.body[i].idshts]);
            if (result.length > 0) {
                await db.query(`UPDATE actividad_has_servicios SET estatus = 1 
                WHERE id_actividad_has_servicios = ?;`, result[0].id_actividad_has_servicios);
            }
            else {
                await db.query(`INSERT INTO actividad_has_servicios SET 
                ahs_has_actividad = ?, ahs_has_servicio = ?, tiempo = ?, estatus = 1;`,
                    [req.body[i].id_actividad, req.body[i].idshts, req.body[i].tiempo]);
            }
        }
        res.json(true);
    }

    public async unSetActividadHShts(req: Request, res: Response) {
        for (let i = 0; i < req.body.length; i++) {
            await db.query(`UPDATE actividad_has_servicios SET estatus = 0
            WHERE ahs_has_actividad = ? and ahs_has_servicio = ?;`, [req.body[i].id_actividad, req.body[i].idshts])
        }
        res.json(true);
    }

    public async getActividadesHShtsTable(req: Request, res: Response) {
        let activhshts = await db.query(`SELECT actividad_has_servicios.id_actividad_has_servicios,
        servicios.servicio, tipos_servicio.tiposervicio, actividades.actividad,
        CONCAT(SUBSTRING_INDEX(tiempo, '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX(tiempo, '.', -1)*60),2),'.',-1)) AS displayTime
        FROM actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad=actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio=servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios  on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio WHERE actividad_has_servicios. estatus = 1;`)
        res.json(activhshts);
    }

    public async getTServicioForTicket(req: Request, res: Response) {
        let tiposServicio = await db.query(`SELECT idtipos_servicio, tiposervicio
        FROM servicio_has_tipo_servicio
        INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE shts_has_servicio = ? AND servicio_has_tipo_servicio.estatus=1;`, req.body.servicio)
        res.json(tiposServicio);
    }

    public async getActividadesForTicket(req: Request, res: Response) {
        let actividades = await db.query(`SELECT actividad_has_servicios.id_actividad_has_servicios AS id_actividad, 
        actividades.actividad, actividad_has_servicios.tiempo
        FROM actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad=actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio=servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE servicio_has_tipo_servicio.shts_has_servicio = ? AND servicio_has_tipo_servicio.shts_has_tipo_servicio = ? 
        AND actividad_has_servicios.estatus = 1;`, [req.body.servicio, req.body.tipoServicio])
        res.json(actividades);
    }
}

const serviciosController = new ServiciosController()
export default serviciosController