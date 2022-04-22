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
            yield database_1.default.query(`INSERT INTO equipos SET equipo = ?, propiedad = ?, no_serie = ?, descripcion = ?,
         estatus = 'ACTIVO', tipo_idtipo = ?, marcas_id_marca = ?;`, [req.body.equipo, req.body.propiedad, req.body.no_serie,
                req.body.descripcion, req.body.tipo, req.body.marca], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    updateEquipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE equipos SET equipo = ?, propiedad = ?, no_serie = ?, descripcion = ?,
        tipo_idtipo = ?, marcas_id_marca = ? WHERE idequipo = ?;`, [req.body.equipo, req.body.propiedad, req.body.no_serie,
                req.body.descripcion, req.body.tipo, req.body.marca, req.body.idequipo], function (err, result, fields) {
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
            yield database_1.default.query(`SELECT idequipo, equipo, propiedad, no_serie, descripcion, estatus, tipo_equipo AS tipo, marca
        FROM equipos
        INNER JOIN tipo ON equipos.tipo_idtipo = tipo.idtipo
        INNER JOIN marcas ON equipos.marcas_id_marca = marcas.id_marca
        WHERE estatus = 'ACTIVO';`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
}
const equiposController = new EquiposController();
exports.default = equiposController;
