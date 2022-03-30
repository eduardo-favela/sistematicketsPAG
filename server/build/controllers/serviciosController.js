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
            yield database_1.default.query(`SELECT * FROM servicios order by servicio;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getTiposServicios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM tipos_servicio where servicios_idservicios = ? ORDER by tiposervicio;`, req.body.servicio, function (err, result, fields) {
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
}
const serviciosController = new ServiciosController();
exports.default = serviciosController;
