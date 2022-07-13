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
class EquipoSistemasController {
    getEquipoSistemas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT concat(nombre, ' ',apellido_paterno, ' ') as nombre, idempleado,
        departamentos_sistema_iddepartamento as depto
        FROM equipo_sistemas
        inner join empleados on empleados_idempleado=empleados.idempleado;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getEquipoSistemasFiltro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let condition = "";
            if (req.body.depto == 5) {
                'WHERE servicios.depto = AND servicios.depto = 2';
            }
            else if (req.body.depto == 6) {
                'WHERE servicios.depto = AND servicios.depto = 1';
            }
            const equipoSistemas = yield database_1.default.query(`SELECT idempleado, nombre
        FROM empleados
        WHERE idempleado in (SELECT distinct asignacion 
        FROM tickets
        INNER JOIN actividad_has_servicios ON tickets.actividad_has_shts = actividad_has_servicios.id_actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad = actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio = servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        ${condition});`);
            res.json(equipoSistemas);
        });
    }
}
const equipoSistemasController = new EquipoSistemasController();
exports.default = equipoSistemasController;
