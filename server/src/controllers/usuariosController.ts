import { Request, Response } from 'express'
import db from '../database'

class UsuariosController {

    public async getUsuarios(req: Request, res: Response) {
        await db.query(`SELECT empleados.idempleado, 
        CONCAT(TRIM(empleados.nombre),' ', TRIM(empleados.apellido_paterno),' ', TRIM(empleados.apellido_materno)) AS nombre,
        empleados.nombre AS nombres, empleados.apellido_paterno AS apellido_p, empleados.apellido_materno AS apellido_m,
        empleados.telefono, empleados.correo, uens.uen, puestos.puesto, departamentos.departamento
        FROM empleados
        INNER JOIN uens ON empleados.UENS_idUEN = uens.idUEN
        INNER JOIN puestos ON empleados.puestos_id_puesto = puestos.id_puesto
        INNER JOIN departamentos ON empleados.departamentos_id_departamento = departamentos.id_departamento
        WHERE empleados.activo = 1 ORDER BY empleados.nombre;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getTiposUsuario(req: Request, res: Response) {
        await db.query(`SELECT id_tipos_usuarios as idtipousuario, tipo_usuario as tipousuario 
        FROM tipos_usuarios`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getUens(req: Request, res: Response) {
        await db.query(`SELECT idUEN AS id, UEN AS uen
        FROM uens WHERE uens.status = 'ACTIVO';`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getPuestos(req: Request, res: Response) {
        await db.query(`SELECT id_puesto AS id, puesto FROM puestos;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async getDeptos(req: Request, res: Response) {
        await db.query(`SELECT id_departamento AS id, departamento as depto FROM departamentos;`, function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async setColaborador(req: Request, res: Response) {
        await db.query(`INSERT INTO empleados SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, 
        telefono = ?, correo = ?, 
        UENS_idUEN = ?, puestos_id_puesto = ?, departamentos_id_departamento = ?;`, [req.body.nombres, req.body.apellido_paterno,
        req.body.apellido_materno, req.body.telefono, req.body.correo, req.body.uen, req.body.puesto,
        req.body.departamento], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async updateColaborador(req: Request, res: Response) {
        await db.query(`UPDATE empleados SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, 
        telefono = ?, correo = ?, 
        UENS_idUEN = ?, puestos_id_puesto = ?, departamentos_id_departamento = ? WHERE idempleado = ?;`, [req.body.nombres, req.body.apellido_p,
        req.body.apellido_m, req.body.telefono, req.body.correo, req.body.uen, req.body.puesto,
        req.body.departamento, req.body.idempleado], function (err: any, result: any, fields: any) {
            if (err) throw err
            res.json(result)
        })
    }

    public async disableColab(req: Request, res: Response) {
        await db.query(`UPDATE empleados SET activo = 0 WHERE idempleado = ?;`, [req.body.id],
            function (err: any, result: any, fields: any) {
                if (err) throw err
                res.json(result)
            })
    }
}

const usuariosController = new UsuariosController()
export default usuariosController