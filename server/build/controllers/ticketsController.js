"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class TicketsController {
    getUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idempleado, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) as nombre, uens.uen, 
        puestos.puesto, departamentos.departamento 
        FROM sistematicketspag.empleados 
        inner join uens on empleados.UENS_idUEN = uens.idUEN
        inner join puestos on empleados.puestos_id_puesto = puestos.id_puesto
        inner join departamentos on empleados.departamentos_id_departamento = departamentos.id_departamento`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    geEstatusTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM estatus ORDER BY idestatus;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    setTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO tickets SET fecha=?, tiempo_resolucion_servicio=?,
        descripcion_servicio=?, servicio_para_uen=?, empleados_idempleado=?,
        estatus_idestatus=?, asignacion=?, actividad_has_shts=?`, [req.body.ticket.fecha, req.body.ticket.tiempo_resolucion_servicio,
                req.body.ticket.descripcion, req.body.ticket.servicioparauen, req.body.ticket.usuario, req.body.ticket.estatus, req.body.ticket.asignacion,
                req.body.ticket.actividad], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    if (req.body.equipoticket) {
                        yield database_1.default.query(`INSERT INTO ticket_has_equipo SET ticket_id_ticket = ?, equipo_id_equipo = ?;`, [result.insertId,
                            req.body.equipoticket], function (err, results, fields) {
                            res.json(result);
                        });
                    }
                    else {
                        res.json(result);
                    }
                });
            });
        });
    }
    setCommentsFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE tickets SET comentarios = ?, fecha_respuesta = ? WHERE idticket = ?`, [req.body.comentarios, req.body.fechaRespuesta, req.body.idticket], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    res.json(true);
                });
            });
        });
    }
    setSeguimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO seguimientos SET fecha = ?, comentarios = ?, tiemporesolucion = ?, tickets_idticket = ?;`, [req.body.fecha, req.body.comentarios, req.body.tiemporesolucion, req.body.idticket], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    yield database_1.default.query(`UPDATE tickets SET estatus_idestatus = 2 WHERE idticket = ?;`, req.body.idticket);
                    res.json(true);
                });
            });
        });
    }
    getSeguimientosTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let seguimientos = yield database_1.default.query(`SELECT idseguimiento, CONCAT(SUBSTRING_INDEX(ROUND(tiemporesolucion,2), '.', 1), ':',
        SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX(ROUND(tiemporesolucion,2), '.', -1)*60),2),'.',-1)) AS tiempoResolucion,
        fecha, comentarios
        FROM seguimientos
        WHERE tickets_idticket = ?;`, [req.body.idticket]);
            res.json(seguimientos);
        });
    }
    ticketSolucionado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let tiemposolucion = yield database_1.default.query(`SELECT ROUND(SUM(tiemporesolucion),2)  AS tiempoResolucion 
        FROM seguimientos WHERE tickets_idticket = ?;`, req.body.idticket);
            yield database_1.default.query(`UPDATE tickets SET estatus_idestatus = 3, tiempo_resolucion_real = ? WHERE idticket = ?;`, [tiemposolucion[0].tiempoResolucion, req.body.idticket], function (err, result, fields) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    res.json(true);
                });
            });
        });
    }
    getTicketsForTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let tickets = [];
            if (req.body.estatus != 0) {
                tickets = yield database_1.default.query(`SELECT idticket, fecha, fecha_respuesta, descripcion_servicio, comentarios,
            CONCAT(TRIM(empl.nombre), ' ',TRIM(empl.apellido_paterno), ' ', TRIM(empl.apellido_materno)) AS asignacion,
            CONCAT(TRIM(emp.nombre), ' ',TRIM(emp.apellido_paterno), ' ', TRIM(emp.apellido_materno)) AS empleado,
            CONCAT(servicios.servicio,', ',tipos_servicio.tiposervicio,', ' ,actividades.actividad) AS servicio,
            estatus.estatus, estatus_idestatus,
            CASE
                WHEN servicio_para_uen = 1 THEN 'SI'
                WHEN servicio_para_uen= 0 THEN 'NO'
            END AS servpuen,
            CONCAT(SUBSTRING_INDEX(tiempo_resolucion_servicio, '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX(tiempo_resolucion_servicio, '.', -1)*60),2),'.',-1)) AS tiempo_res_serv,
            CONCAT(SUBSTRING_INDEX((SELECT ROUND(SUM(tiemporesolucion),2) FROM seguimientos WHERE tickets_idticket = idticket), '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX((SELECT ROUND(SUM(tiemporesolucion),2) FROM seguimientos WHERE tickets_idticket = idticket), '.', -1)*60),2),'.',-1)) AS tiempo_Res
            FROM tickets
            INNER JOIN empleados AS emp ON tickets.empleados_idempleado = emp.idempleado
            INNER JOIN estatus ON tickets.estatus_idestatus = estatus.idestatus
            INNER JOIN equipo_sistemas ON tickets.asignacion = equipo_sistemas.empleados_idempleado
            INNER JOIN empleados AS empl ON equipo_sistemas.empleados_idempleado = empl.idempleado
            INNER JOIN actividad_has_servicios ON tickets.actividad_has_shts = actividad_has_servicios.id_actividad_has_servicios
            INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad = actividades.id_actividad
            INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio = servicio_has_tipo_servicio.idservicio_has_tipo_servicio
            INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
            INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
            WHERE estatus_idestatus = ? AND tickets.fecha BETWEEN ? AND ?
            LIMIT 100;`, [req.body.estatus, req.body.fecha1 + ' 00:00', req.body.fecha2 + ' 23:59']);
            }
            else {
                tickets = yield database_1.default.query(`SELECT idticket, fecha, fecha_respuesta, descripcion_servicio, comentarios,
            CONCAT(TRIM(empl.nombre), ' ',TRIM(empl.apellido_paterno), ' ', TRIM(empl.apellido_materno)) AS asignacion,
            CONCAT(TRIM(emp.nombre), ' ',TRIM(emp.apellido_paterno), ' ', TRIM(emp.apellido_materno)) AS empleado,
            CONCAT(servicios.servicio,', ',tipos_servicio.tiposervicio,', ' ,actividades.actividad) AS servicio,
            estatus.estatus, estatus_idestatus,
            CASE
                WHEN servicio_para_uen = 1 THEN 'SI'
                WHEN servicio_para_uen= 0 THEN 'NO'
            END AS servpuen,
            CONCAT(SUBSTRING_INDEX(tiempo_resolucion_servicio, '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX(tiempo_resolucion_servicio, '.', -1)*60),2),'.',-1)) AS tiempo_res_serv,
            CONCAT(SUBSTRING_INDEX((SELECT ROUND(SUM(tiemporesolucion),2) FROM seguimientos WHERE tickets_idticket = idticket), '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX((SELECT ROUND(SUM(tiemporesolucion),2) FROM seguimientos WHERE tickets_idticket = idticket), '.', -1)*60),2),'.',-1)) AS tiempo_Res
            FROM tickets
            INNER JOIN empleados AS emp ON tickets.empleados_idempleado = emp.idempleado
            INNER JOIN estatus ON tickets.estatus_idestatus = estatus.idestatus
            INNER JOIN equipo_sistemas ON tickets.asignacion = equipo_sistemas.empleados_idempleado
            INNER JOIN empleados AS empl ON equipo_sistemas.empleados_idempleado = empl.idempleado
            INNER JOIN actividad_has_servicios ON tickets.actividad_has_shts = actividad_has_servicios.id_actividad_has_servicios
            INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad = actividades.id_actividad
            INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio = servicio_has_tipo_servicio.idservicio_has_tipo_servicio
            INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
            INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
            WHERE tickets.fecha BETWEEN ? AND ?
            LIMIT 100;`, [req.body.fecha1 + ' 00:00', req.body.fecha2 + ' 23:59']);
            }
            res.json(tickets);
        });
    }
}
const ticketsController = new TicketsController();
exports.default = ticketsController;
