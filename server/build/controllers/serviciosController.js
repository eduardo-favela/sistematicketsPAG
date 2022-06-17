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
    getServiciosDepto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let condition = '';
            if (req.body.depto != 4) {
                if (req.body.depto == 1 || req.body.depto == 2 || req.body.depto == 3) {
                    condition = 'AND depto = ' + req.body.depto;
                }
                else if (req.body.depto == 5) {
                    condition = 'AND depto = 2';
                }
                else if (req.body.depto == 6) {
                    condition = 'AND depto = 1';
                }
            }
            yield database_1.default.query(`SELECT * FROM servicios WHERE estatus = 1 ${condition};`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getActividades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM actividades ORDER BY actividad;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //OBTENER LAS RELACIONES ENTRE SERVICIOS Y TIPOS DE SERVICIO QUE NO ESTÉN RELACIONADAS CON LAS ACTIVIDADES
    getShtsNoAsignados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idservicio_has_tipo_servicio as idshts, servicio, tipos_servicio.tiposervicio
        FROM servicio_has_tipo_servicio
        INNER JOIN servicios  on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE servicio_has_tipo_servicio.estatus=1
        AND servicio_has_tipo_servicio.idservicio_has_tipo_servicio NOT IN
        (SELECT ahs_has_servicio
        FROM actividad_has_servicios
        WHERE ahs_has_actividad = ? AND actividad_has_servicios.estatus = 1);`, req.body.id_actividad, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //OBTENER LAS RELACIONES ENTRE SERVICIOS Y TIPOS DE SERVICIO QUE ESTÁN RELACIONADAS CON LAS ACTIVIDADES
    getShtsAsignados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT ahs_has_actividad AS id_actividad, servicio_has_tipo_servicio.idservicio_has_tipo_servicio AS idshts,
        servicios.servicio, tipos_servicio.tiposervicio,
        CONCAT(SUBSTRING_INDEX(tiempo, '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX(tiempo, '.', -1)*60),2),'.',-1)) AS displayTime
        FROM actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad=actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio=servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios  on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE ahs_has_actividad = ? AND actividad_has_servicios.estatus = 1;`, req.body.id_actividad, function (err, result, fields) {
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
            FROM servicio_has_tipo_servicio
            INNER JOIN tipos_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
            WHERE shts_has_servicio = ? and servicio_has_tipo_servicio.estatus = 1);`, req.body.idservicio, function (err, result, fields) {
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
    updateActivShts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE actividad_has_servicios 
        SET tiempo = ?  WHERE id_actividad_has_servicios = ?;`, [req.body.tiempo, req.body.ahshts]);
            res.json(true);
        });
    }
    setActividadHShts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < req.body.length; i++) {
                let result = yield database_1.default.query(`SELECT * FROM actividad_has_servicios 
            WHERE ahs_has_actividad = ? AND ahs_has_servicio = ?;`, [req.body[i].id_actividad, req.body[i].idshts]);
                if (result.length > 0) {
                    yield database_1.default.query(`UPDATE actividad_has_servicios SET estatus = 1 
                WHERE id_actividad_has_servicios = ?;`, result[0].id_actividad_has_servicios);
                }
                else {
                    yield database_1.default.query(`INSERT INTO actividad_has_servicios SET 
                ahs_has_actividad = ?, ahs_has_servicio = ?, tiempo = ?, estatus = 1;`, [req.body[i].id_actividad, req.body[i].idshts, req.body[i].tiempo]);
                }
            }
            res.json(true);
        });
    }
    unSetActividadHShts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < req.body.length; i++) {
                yield database_1.default.query(`UPDATE actividad_has_servicios SET estatus = 0
            WHERE ahs_has_actividad = ? and ahs_has_servicio = ?;`, [req.body[i].id_actividad, req.body[i].idshts]);
            }
            res.json(true);
        });
    }
    getActividadesHShtsTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let activhshts = yield database_1.default.query(`SELECT actividad_has_servicios.id_actividad_has_servicios,
        servicios.servicio, tipos_servicio.tiposervicio, actividades.actividad,
        CONCAT(SUBSTRING_INDEX(tiempo, '.', 1), ':', SUBSTRING_INDEX(ROUND(CONCAT(0,'.',SUBSTRING_INDEX(tiempo, '.', -1)*60),2),'.',-1)) AS displayTime
        FROM actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad=actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio=servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios  on servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio on servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio WHERE actividad_has_servicios. estatus = 1;`);
            res.json(activhshts);
        });
    }
    getTServicioForTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let tiposServicio = yield database_1.default.query(`SELECT idtipos_servicio, tiposervicio
        FROM servicio_has_tipo_servicio
        INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE shts_has_servicio = ? AND servicio_has_tipo_servicio.estatus=1;`, req.body.servicio);
            res.json(tiposServicio);
        });
    }
    getActividadesForTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let actividades = yield database_1.default.query(`SELECT actividad_has_servicios.id_actividad_has_servicios AS id_actividad, 
        actividades.actividad, actividad_has_servicios.tiempo
        FROM actividad_has_servicios
        INNER JOIN actividades ON actividad_has_servicios.ahs_has_actividad=actividades.id_actividad
        INNER JOIN servicio_has_tipo_servicio ON actividad_has_servicios.ahs_has_servicio=servicio_has_tipo_servicio.idservicio_has_tipo_servicio
        INNER JOIN servicios ON servicio_has_tipo_servicio.shts_has_servicio=servicios.idservicios
        INNER JOIN tipos_servicio ON servicio_has_tipo_servicio.shts_has_tipo_servicio=tipos_servicio.idtipos_servicio
        WHERE servicio_has_tipo_servicio.shts_has_servicio = ? AND servicio_has_tipo_servicio.shts_has_tipo_servicio = ? 
        AND actividad_has_servicios.estatus = 1;`, [req.body.servicio, req.body.tipoServicio]);
            res.json(actividades);
        });
    }
}
const serviciosController = new ServiciosController();
exports.default = serviciosController;
