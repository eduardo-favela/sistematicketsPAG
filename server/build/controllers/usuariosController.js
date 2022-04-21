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
class UsuariosController {
    getUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT empleados.idempleado, 
        CONCAT(TRIM(empleados.nombre),' ', TRIM(empleados.apellido_paterno),' ', TRIM(empleados.apellido_materno)) AS nombre,
        empleados.nombre AS nombres, empleados.apellido_paterno AS apellido_p, empleados.apellido_materno AS apellido_m,
        empleados.telefono, empleados.correo, uens.uen, puestos.puesto, departamentos.departamento
        FROM empleados
        INNER JOIN uens ON empleados.UENS_idUEN = uens.idUEN
        INNER JOIN puestos ON empleados.puestos_id_puesto = puestos.id_puesto
        INNER JOIN departamentos ON empleados.departamentos_id_departamento = departamentos.id_departamento
        WHERE empleados.activo = 1 ORDER BY empleados.nombre;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getTiposUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT id_tipos_usuarios as idtipousuario, tipo_usuario as tipousuario 
        FROM tipos_usuarios`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getUens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idUEN AS id, UEN AS uen
        FROM uens WHERE uens.status = 'ACTIVO';`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getPuestos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT id_puesto AS id, puesto FROM puestos;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getDeptos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT id_departamento AS id, departamento as depto FROM departamentos;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    setColaborador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO empleados SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, 
        telefono = ?, correo = ?, 
        UENS_idUEN = ?, puestos_id_puesto = ?, departamentos_id_departamento = ?;`, [req.body.nombres, req.body.apellido_paterno,
                req.body.apellido_materno, req.body.telefono, req.body.correo, req.body.uen, req.body.puesto,
                req.body.departamento], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    updateColaborador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE empleados SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, 
        telefono = ?, correo = ?, 
        UENS_idUEN = ?, puestos_id_puesto = ?, departamentos_id_departamento = ? WHERE idempleado = ?;`, [req.body.nombres, req.body.apellido_p,
                req.body.apellido_m, req.body.telefono, req.body.correo, req.body.uen, req.body.puesto,
                req.body.departamento, req.body.idempleado], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    disableColab(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE empleados SET activo = 0 WHERE idempleado = ?;`, [req.body.id], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
}
const usuariosController = new UsuariosController();
exports.default = usuariosController;
