"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equiposController_1 = __importDefault(require("../controllers/equiposController"));
class EquiposRouter {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/getEquipos', equiposController_1.default.getEquipos);
        this.router.get('/getTiposEquipos', equiposController_1.default.getTiposEquipos);
        this.router.get('/getMarcasEquipos', equiposController_1.default.getMarcasEquipos);
    }
}
const equiposRouter = new EquiposRouter();
exports.default = equiposRouter.router;
