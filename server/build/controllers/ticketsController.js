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
    setTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO tickets SET fecha=?, fecha_respuesta=?, tiempo_resolucion_servicio=?,
        descripcion_servicio=?, comentarios=?, servicio_para_uen=?, empleados_idempleado=?,
        estatus_idestatus=?, asignacion=?, actividad_has_shts=?`, [req.body.ticket.fecha, req.body.ticket.fecharespuesta, req.body.ticket.tiempo_resolucion_servicio,
                req.body.ticket.descripcion, req.body.ticket.comentarios, req.body.ticket.servicioparauen, req.body.ticket.usuario, req.body.ticket.estatus, req.body.ticket.asignacion,
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
    getTicketsForTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let tickets = yield database_1.default.query(`SELECT idticket, fecha, fecha_respuesta, descripcion_servicio, comentarios,
        CONCAT(TRIM(empl.nombre), ' ',TRIM(empl.apellido_paterno), ' ', TRIM(empl.apellido_materno)) AS asignacion,
        CONCAT(TRIM(emp.nombre), ' ',TRIM(emp.apellido_paterno), ' ', TRIM(emp.apellido_materno)) AS empleado,
        CONCAT(servicios.servicio,', ',tipos_servicio.tiposervicio,', ' ,actividades.actividad) AS servicio,
        estatus.estatus,
        CASE
            WHEN servicio_para_uen = 1 THEN 'SI'
            WHEN servicio_para_uen= 0 THEN 'NO'
        END AS servpuen,
        CONCAT(SUBSTRING_INDEX(tiempo_resolucion_servicio, '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX(tiempo_resolucion_servicio, '.', -1)*60),2),'.',-1)) AS tiempo_res_serv
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
        LIMIT 100;`, [req.body.servicio, req.body.tipoServicio]);
            res.json(tickets);
        });
    }
}
const ticketsController = new TicketsController();
exports.default = ticketsController;
