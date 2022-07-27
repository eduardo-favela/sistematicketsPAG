import { Request, Response } from 'express'
import db from '../database'

class EstadisticosController {

    public async getStatistics(req: Request, res: Response) {

        let query = ''
        if (req.body.tipoGrafica == 0) {
            query = `SELECT UEN as label, COUNT(*) AS cantidad,
            ROUND(((COUNT(*) / (select count(*) from tickets WHERE fecha BETWEEN ? AND ?)) * 100), 2) AS porcentaje
            FROM tickets
            INNER JOIN empleados ON tickets.empleados_idempleado = empleados.idempleado
            INNER JOIN uens ON empleados.UENS_idUEN = uens.idUEN
            WHERE fecha BETWEEN ? AND ?
            GROUP BY idUEN;`
        }
        else {
            query = `SELECT COUNT(*) AS cantidad, servicio as label
            FROM tickets
            INNER JOIN empleados ON tickets.empleados_idempleado = empleados.idempleado
            INNER JOIN uens ON empleados.UENS_idUEN = uens.idUEN
            INNER JOIN actividad_has_servicios ON tickets.actividad_has_shts = actividad_has_servicios.id_actividad_has_servicios
            INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad = actividades.id_actividad
            INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio = servicio_has_tipo_servicio.idservicio_has_tipo_servicio
            INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
            INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
            WHERE fecha BETWEEN ? AND ?
            GROUP BY servicio;`
        }
        await db.query(query, [req.body.fecha1, req.body.fecha2, req.body.fecha1, req.body.fecha2], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getStatsTipoServicio(req: Request, res: Response) {
        await db.query(`SELECT COUNT(*) AS cantidad, tiposervicio as label
        FROM tickets
        INNER JOIN empleados ON tickets.empleados_idempleado = empleados.idempleado
        INNER JOIN uens ON empleados.UENS_idUEN = uens.idUEN
        INNER JOIN actividad_has_servicios ON tickets.actividad_has_shts = actividad_has_servicios.id_actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad = actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio = servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE fecha BETWEEN ? AND ? AND servicio = ?
        GROUP BY tiposervicio;`, [req.body.fecha1, req.body.fecha2, req.body.servicio], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getStatsActividad(req: Request, res: Response) {
        await db.query(`SELECT COUNT(*) AS cantidad, tiposervicio as label
        FROM tickets
        INNER JOIN empleados ON tickets.empleados_idempleado = empleados.idempleado
        INNER JOIN uens ON empleados.UENS_idUEN = uens.idUEN
        INNER JOIN actividad_has_servicios ON tickets.actividad_has_shts = actividad_has_servicios.id_actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad = actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio = servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE fecha BETWEEN ? AND ? AND tiposervicio = ?
        GROUP BY actividad;`, [req.body.fecha1, req.body.fecha2, req.body.tiposervicio], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
}

const estadisticosController = new EstadisticosController()
export default estadisticosController