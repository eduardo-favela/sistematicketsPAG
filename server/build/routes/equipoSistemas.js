"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equipoSistemas_1 = __importDefault(require("../controllers/equipoSistemas"));
class EquipoSistemasRouter {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getEquipoSistemas', equipoSistemas_1.default.getEquipoSistemas);
        this.router.post('/getEquipoSistemasFiltro', equipoSistemas_1.default.getEquipoSistemasFiltro);
    }
}
const equipoSistemasRouter = new EquipoSistemasRouter();
exports.default = equipoSistemasRouter.router;
