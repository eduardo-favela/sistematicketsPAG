"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviciosController_1 = __importDefault(require("../controllers/serviciosController"));
class ServiciosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getServicios', serviciosController_1.default.getServicios);
        this.router.get('/getDeptosSistemas', serviciosController_1.default.getDeptosSistemas);
        this.router.post('/getTiposServicios', serviciosController_1.default.getTiposServicios);
        this.router.post('/setServicio', serviciosController_1.default.setServicio);
    }
}
const serviciosRoutes = new ServiciosRoutes();
exports.default = serviciosRoutes.router;
