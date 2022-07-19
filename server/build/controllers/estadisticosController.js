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
class EstadisticosController {
    getStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT UEN, COUNT(*) AS cantidad,
        ROUND(((COUNT(*) / (select count(*) from tickets WHERE fecha BETWEEN ? AND ?)) * 100), 2) AS porcentaje
        FROM tickets
        INNER JOIN empleados ON tickets.empleados_idempleado = empleados.idempleado
        INNER JOIN uens ON empleados.UENS_idUEN = uens.idUEN
        WHERE fecha BETWEEN ? AND ?
        GROUP BY idUEN ORDER BY cantidad;`, [req.body.fecha1, req.body.fecha2, req.body.fecha1, req.body.fecha2], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
}
const estadisticosController = new EstadisticosController();
exports.default = estadisticosController;
