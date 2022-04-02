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
class ServiciosController {
    getServicios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM servicios WHERE estatus = 1;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getActividades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM actividades;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //OBTENER TODOS LOS SERVICIOS PARA MOSTRARLOS EN LA TABLA PARA EDITARLOS
    getServiciosTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idservicios, servicio, depto, departamento, 
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
        INNER JOIN departamentos_sistema on servicios.depto=departamentos_sistema.iddepartamento;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //OBTENER LOS TIPOS DE SERVICIO QUE NO TIENEN UNA RELACIÓN ACTIVA CON EL SERVICIO SLECCIONADO
    getTiposServicios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM tipos_servicio WHERE idtipos_servicio NOT IN (SELECT idtipos_servicio
            FROM tipos_servicio
            INNER JOIN servicio_has_tipo_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
            INNER JOIN servicios on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
            WHERE idservicios = ? and servicio_has_tipo_servicio.estatus = 1);`, req.body.idservicio, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //OBTENER TODOS LOS TIPOS DE SERVICIOS PARA MOSTRARLOS EN LA TABLA PARA EDITARLOS
    getTiposServicioTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idtipos_servicio, tiposervicio, estatus AS estatusid,
        CASE
            WHEN estatus = 1 THEN 'ACTIVO'
            WHEN estatus = 0 THEN 'INACTIVO'
        END AS estatus
        FROM tipos_servicio;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //OBTENER LOS TIPOS DE SERVICIO QUE TIENEN UNA RELACIÓN ACTIVA CON EL SERVICIO SELECCIONADO
    getTiposServicioAsignados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idtipos_servicio, tiposervicio, idservicios as idServicio
        FROM tipos_servicio
        INNER JOIN servicio_has_tipo_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        INNER JOIN servicios on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        WHERE idservicios = ? and servicio_has_tipo_servicio.estatus = 1;`, req.body.idservicio, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getDeptosSistemas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM departamentos_sistema;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //REGISTRA EL SERVICIO INGRESADO, PERO PRIMERO VERIFICA SI YA EXISTE, PARA NO DUPLICARLO
    setServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const servicioRes = yield database_1.default.query(`SELECT * FROM servicios WHERE servicio = ?`, req.body.servicio);
            if (servicioRes.length > 0) {
                res.json(false);
            }
            else {
                yield database_1.default.query(`INSERT INTO servicios SET ?;`, [req.body], function (err, result, fields) {
                    if (err)
                        throw err;
                    res.json(result);
                });
            }
        });
    }
    updateServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE servicios SET servicio = ?, asignar_equipo = ?, depto = ?, estatus = ? 
        WHERE idservicios = ?`, [req.body.servicio, req.body.asignar_equipoid, req.body.depto, req.body.estatusid, req.body.idservicios], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(true);
            });
        });
    }
    //REGISTRA EL TIPO DE SERVICIO INGRESADO, PERO PRIMERO VERIFICA SI YA EXISTE, PARA NO DUPLICARLO
    setTipoServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const servicioRes = yield database_1.default.query(`SELECT * FROM tipos_servicio WHERE tiposervicio = ?`, req.body.tipoServicio);
            if (servicioRes.length > 0) {
                res.json(false);
            }
            else {
                yield database_1.default.query(`INSERT INTO tipos_servicio SET ?;`, [req.body], function (err, result, fields) {
                    if (err)
                        throw err;
                    res.json(result);
                });
            }
        });
    }
    updateTipoServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE tipos_servicio SET tiposervicio = ?, estatus = ?
        WHERE idtipos_servicio = ?`, [req.body.tiposervicio, req.body.estatus, req.body.idtipos_servicio], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(true);
            });
        });
    }
    //REGISTRA LA RELACIÓN DE UN SERVICIO Y UN TIPO DE SERVICIO, PERO ANTES REVISA SI YA EXISTE Y SOLO LA ACTUALIZA PARA NO DUPLICARLA
    setServicioHTS(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < req.body.length; i++) {
                let result = yield database_1.default.query(`SELECT * FROM servicio_has_tipo_servicio 
           where shts_has_servicio = ? and shts_has_tipo_servicio = ?;`, [parseInt(req.body[i].idServicio), req.body[i].idtipos_servicio]);
                if (result.length > 0) {
                    yield database_1.default.query(`UPDATE servicio_has_tipo_servicio SET estatus = 1
               WHERE idservicio_has_tipo_servicio = ?`, result[0].idservicio_has_tipo_servicio);
                }
                else {
                    yield database_1.default.query(`INSERT INTO servicio_has_tipo_servicio SET 
                shts_has_servicio = ?, shts_has_tipo_servicio = ?, estatus = 1;`, [parseInt(req.body[i].idServicio), req.body[i].idtipos_servicio]);
                }
            }
            res.json(true);
        });
    }
    //DESHABILITA LA RELACIÓN DEL SERVICIO Y TIPO DE SERVICIO
    unsetServicioHTS(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < req.body.length; i++) {
                yield database_1.default.query(`UPDATE servicio_has_tipo_servicio SET estatus = 0
            WHERE shts_has_servicio = ? and shts_has_tipo_servicio = ?;`, [req.body[i].idServicio, req.body[i].idtipos_servicio]);
            }
            res.json(true);
        });
    }
    setActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const actividadRes = yield database_1.default.query(`SELECT * FROM actividades WHERE actividad = ?`, req.body.actividad);
            if (actividadRes.length > 0) {
                res.json(false);
            }
            else {
                yield database_1.default.query(`INSERT INTO actividades SET ?;`, [req.body], function (err, result, fields) {
                    if (err)
                        throw err;
                    res.json(true);
                });
            }
        });
    }
    updateActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE actividades SET actividad = ?  WHERE id_actividad = ?;`, [req.body.actividad, req.body.id_actividad]);
            res.json(true);
        });
    }
}
const serviciosController = new ServiciosController();
exports.default = serviciosController;
