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
class EquiposController {
    getEquipos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idequipo, equipo, tipo.tipo_equipo as tipoEquipo, no_serie
        FROM empleados_has_equipos
        inner join empleados on empleados_has_equipos.empleados_idempleado=empleados.idempleado
        inner join equipos on empleados_has_equipos.equipos_idequipo=equipos.idequipo
        inner join tipo on equipos.tipo_idtipo=tipo.idtipo
        where empleados_idempleado = ? and empleados_has_equipos.empleados_has_estatus = 'ACTIVO';`, req.body.idusuario, function (err, result, fields) {
                if (err)
                    throw console.error(err);
                res.json(result);
            });
        });
    }
    getEquiposFormngEq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = {
                asignados: null,
                noasignados: null
            };
            result.asignados = yield database_1.default.query(`SELECT id_empleados_has_equipos as id_c_has_e, idequipo, equipo, tipo.tipo_equipo as tipo, no_serie
        FROM empleados_has_equipos
        inner join empleados on empleados_has_equipos.empleados_idempleado=empleados.idempleado
        inner join equipos on empleados_has_equipos.equipos_idequipo=equipos.idequipo
        inner join tipo on equipos.tipo_idtipo=tipo.idtipo
        where empleados_idempleado = ? and empleados_has_equipos.empleados_has_estatus = 'ACTIVO';`, req.body.idusuario);
            result.noasignados = yield database_1.default.query(`SELECT idequipo, equipo, tipo.tipo_equipo as tipo, no_serie
        FROM equipos
        inner join tipo on equipos.tipo_idtipo=tipo.idtipo
        where equipos.idequipo not in (SELECT eqss.idequipo
        FROM empleados_has_equipos
        inner join empleados on empleados_has_equipos.empleados_idempleado=empleados.idempleado
        inner join equipos as eqss on empleados_has_equipos.equipos_idequipo=eqss.idequipo
        inner join tipo on eqss.tipo_idtipo=tipo.idtipo
        where empleados_idempleado = ? and empleados_has_equipos.empleados_has_estatus = 'ACTIVO');`, req.body.idusuario);
            res.json(result);
        });
    }
    asignarEquipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let asignacion = yield database_1.default.query(`SELECT * FROM empleados_has_equipos 
        WHERE empleados_idempleado = ? AND equipos_idequipo = ? AND empleados_has_estatus = 'INACTIVO';`, [req.body.idempleado, req.body.idequipo]);
            /* console.log(asignacion, req.body) */
            if (asignacion.length > 0) {
                yield database_1.default.query(`UPDATE empleados_has_equipos SET empleados_has_estatus = 'ACTIVO' 
            WHERE id_empleados_has_equipos = ?`, [asignacion[0].id_empleados_has_equipos], function (err, result, fields) {
                    if (err)
                        throw err;
                    res.json(true);
                });
            }
            else {
                yield database_1.default.query(`INSERT INTO empleados_has_equipos SET empleados_idempleado = ?, equipos_idequipo = ?, 
            empleados_has_equipos_responsiva = ?, empleados_has_fecha_asign = ?, empleados_has_estatus = 'ACTIVO';`, [req.body.idempleado, req.body.idequipo, req.body.responsiva, req.body.fechaAsign], function (err, result, fields) {
                    if (err)
                        throw err;
                    res.json(true);
                });
            }
        });
    }
    desAsignarEquipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE empleados_has_equipos SET empleados_has_estatus = 'INACTIVO', empleados_has_fecha_desasign = ?
        WHERE id_empleados_has_equipos = ?`, [req.body.fecha_desasign, req.body.id_c_has_e], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(true);
            });
        });
    }
    desasignarEquipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM tipo ORDER BY tipo_equipo;`, req.body.idusuario, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getTiposEquipos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM tipo ORDER BY tipo_equipo;`, req.body.idusuario, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getMarcasEquipos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM marcas ORDER BY marca;`, req.body.idusuario, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    setEquipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO equipos SET ?;`, [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    updateEquipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let idequipo = req.body.idequipo;
            delete req.body.idequipo;
            yield database_1.default.query(`UPDATE equipos SET ? WHERE idequipo = ?;`, [req.body, idequipo], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    deleteEquipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE equipos SET estatus = 'STOCK' WHERE idequipo = ?;`, [req.body.id], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getEquiposTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idequipo, equipo, propiedad, no_serie, descripcion, estatus, tipo_equipo AS tipo, marca, 
        uen_ubi.UEN as ubicacion, uen_pert.UEN as pertenencia, puestos.puesto,comentarios
        FROM equipos
        INNER JOIN tipo ON equipos.tipo_idtipo = tipo.idtipo
        INNER JOIN marcas ON equipos.marcas_id_marca = marcas.id_marca
        INNER JOIN uens as uen_ubi ON equipos.ubicacion = uen_ubi.idUEN
        INNER JOIN uens as uen_pert ON equipos.pertenencia = uen_pert.idUEN
        INNER JOIN puestos ON equipos.puesto = puestos.id_puesto;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
}
const equiposController = new EquiposController();
exports.default = equiposController;
