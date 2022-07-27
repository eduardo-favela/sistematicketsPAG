"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estadisticosController_1 = __importDefault(require("../controllers/estadisticosController"));
class EstadisticosRouter {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/getStatistics', estadisticosController_1.default.getStatistics);
        this.router.post('/getStatsTipoServicio', estadisticosController_1.default.getStatsTipoServicio);
        this.router.post('/getStatsActividad', estadisticosController_1.default.getStatsActividad);
    }
}
const estadisticosRouter = new EstadisticosRouter();
exports.default = estadisticosRouter.router;
