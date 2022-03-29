import { Request, Response } from 'express'
import db from '../database'

class EquiposFallasController {

    public async getEquipos(req: Request, res: Response){
        await db.query(`select * from equipo_pv`, function(err: any, result: any, fields: any){
            if(err) throw err
            res.json(result)
        })
        //res.json({message: 'ok'})
        
    }

    public async getFallas(req: Request, res: Response){
        await db.query(`select idfallas_equipo as id, falla from equipo_pv_has_fallas_equipo 
        inner join fallas_equipo on equipo_pv_has_fallas_equipo.fallas_equipo_idfallas_equipo=fallas_equipo.idfallas_equipo
        inner join equipo_pv on equipo_pv_has_fallas_equipo.equipo_pv_id=equipo_pv.id
        where equipo_pv_id=?`,[req.body.id],function(err: any, result: any, fields: any){
            if(err) throw err
            res.json(result)
        })
        //res.json({message: 'ok'})
        
    }

    public async registraReporte(req: Request, res: Response){
        await db.query(`INSERT INTO reportes set ?`,[req.body],function(err: any, result: any, fields: any){
            if(err) throw err
            res = res.json(result)
        })
    }

    public async registraEquipo(req: Request, res: Response){
        await db.query(`INSERT INTO detalle_reportes_fallas set ?`,[req.body],function(err: any, result: any, fields: any){
            if(err) throw err
            res = res.json(result)
        })
    }

    public async getReportesDistrito(req: Request, res: Response){
        await db.query(`SELECT idreporte, concat(centrocostos.idCentrosCostos,'-',centrocostos.descripcion) as centrocostos,
        DATE_FORMAT( reportes.fecha,  '%Y-%m-%d' ) as fecha, empleados.nombreEmpleado, tiporeporte.tiporeporte, reportes.comentarios,
        estatus_reporte.estatus_reporte, distritos.distrito FROM reportes
        INNER JOIN centrocostos on reportes.centrocostos_idCentrosCostos=centrocostos.idCentrosCostos
        INNER JOIN distritos on centrocostos.distritos_idDistrito=distritos.idDistrito
        INNER JOIN empleados on reportes.empleados_numEmp=empleados.numEmp
        INNER JOIN tiporeporte on reportes.tiporeporte_id=tiporeporte.id
        INNER JOIN estatus_reporte on reportes.estatus_reporte_id=estatus_reporte.id
        where centrocostos.distritos_idDistrito=? and estatus_reporte.id in (?) and tiporeporte.id=?`,[req.body.distrito,req.body.estatus,req.body.tiporeporte],function(err: any, result: any, fields: any){
            if(err) throw err
            res = res.json(result)
        })
    }

    public async getEstatusReporte(req: Request, res: Response){
        await db.query(`SELECT * FROM estatus_reporte`,function(err: any, result: any, fields: any){
            if(err) throw err
            res = res.json(result)
        })
    }
    
    public async updateEstatusRep(req: Request, res: Response){
        await db.query(`UPDATE reportes SET estatus_reporte_id = ? WHERE idreporte = ?`,[req.body.estatus_reporte,req.body.idreporte],function(err: any, result: any, fields: any){
            if(err) throw err
            res = res.json(result)
        })
    }

    public async registraComentarios(req: Request, res: Response){
        await db.query(`INSERT INTO comentarios_reportes set ?`,[req.body],function(err: any, result: any, fields: any){
            if(err) throw err
            res = res.json(result)
        })
    }

    public async getDetalleReporte(req: Request, res: Response){
        await db.query(`SELECT equipo_pv.nombre as nombre, fallas_equipo.falla as falla, detalle_reportes_fallas.descripcion_falla
            FROM detalle_reportes_fallas
            inner join equipo_pv on detalle_reportes_fallas.equipo_pv_id=equipo_pv.id
            inner join fallas_equipo on detalle_reportes_fallas.fallas_equipo_idfallas_equipo=fallas_equipo.idfallas_equipo
            where reportes_fallas_idreporte= ?`,[req.body.idReporte],function(err: any, result: any, fields: any){
            if(err) throw err
            res = res.json(result)
        })
    }
}

const equiposFallasController = new EquiposFallasController()
export default equiposFallasController