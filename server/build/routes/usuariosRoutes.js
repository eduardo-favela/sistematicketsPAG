"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuariosController_1 = __importDefault(require("../controllers/usuariosController"));
class UsuariosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getUsuarios', usuariosController_1.default.getUsuarios);
        this.router.get('/getTiposUsuario', usuariosController_1.default.getTiposUsuario);
        this.router.get('/getUens', usuariosController_1.default.getUens);
        this.router.get('/getPuestos', usuariosController_1.default.getPuestos);
        this.router.get('/getDeptos', usuariosController_1.default.getDeptos);
        this.router.post('/setColaborador', usuariosController_1.default.setColaborador);
        this.router.post('/updateColaborador', usuariosController_1.default.updateColaborador);
        this.router.post('/disableColab', usuariosController_1.default.disableColab);
    }
}
const usuariosRoutes = new UsuariosRoutes();
exports.default = usuariosRoutes.router;
