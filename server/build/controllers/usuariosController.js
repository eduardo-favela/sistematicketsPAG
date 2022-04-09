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
            yield database_1.default.query(`SELECT idempleado, CONCAT(TRIM(nombre), ' ', TRIM(apellido_paterno), ' ', TRIM(apellido_materno)) as nombre, uens.uen, 
        puestos.puesto, departamentos.departamento, telefono, correo
        FROM sistematicketspag.empleados 
        inner join uens on empleados.UENS_idUEN = uens.idUEN
        inner join puestos on empleados.puestos_id_puesto = puestos.id_puesto
        inner join departamentos on empleados.departamentos_id_departamento = departamentos.id_departamento order by nombre;`, function (err, result, fields) {
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
}
const usuariosController = new UsuariosController();
exports.default = usuariosController;
