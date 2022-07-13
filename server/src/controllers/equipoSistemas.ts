import { Request, Response } from 'express'
import db from '../database'

class EquipoSistemasController {

    public async getEquipoSistemas(req: Request, res: Response) {
        await db.query(`SELECT concat(nombre, ' ',apellido_paterno, ' ') as nombre, idempleado,
        departamentos_sistema_iddepartamento as depto
        FROM equipo_sistemas
        inner join empleados on empleados_idempleado=empleados.idempleado;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }
    
    public async getEquipoSistemasFiltro(req: Request, res: Response) {

        let condition = ""

        if (req.body.depto == 5) {
            'WHERE servicios.depto = AND servicios.depto = 2'
        }
        else if (req.body.depto == 6) {
            'WHERE servicios.depto = AND servicios.depto = 1'
        }

        const equipoSistemas = await db.query(`SELECT idempleado, nombre
        FROM empleados
        WHERE idempleado in (SELECT distinct asignacion 
        FROM tickets
        INNER JOIN actividad_has_servicios ON tickets.actividad_has_shts = actividad_has_servicios.id_actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad = actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio = servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        ${condition});`);
        res.json(equipoSistemas)
    }
}

const equipoSistemasController = new EquipoSistemasController()
export default equipoSistemasController