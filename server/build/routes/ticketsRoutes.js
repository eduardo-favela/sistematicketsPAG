"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketsController_1 = __importDefault(require("../controllers/ticketsController"));
class TicketsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getUsuarios', ticketsController_1.default.getUsuarios);
        this.router.get('/geEstatusTickets', ticketsController_1.default.geEstatusTickets);
        this.router.post('/getTicketsForTable', ticketsController_1.default.getTicketsForTable);
        this.router.post('/getTicketsOpen', ticketsController_1.default.getTicketsOpen);
        this.router.post('/setTicket', ticketsController_1.default.setTicket);
        this.router.post('/setCommentsFecha', ticketsController_1.default.setCommentsFecha);
        this.router.post('/setSeguimiento', ticketsController_1.default.setSeguimiento);
        this.router.post('/getSeguimientosTicket', ticketsController_1.default.getSeguimientosTicket);
        this.router.post('/ticketSolucionado', ticketsController_1.default.ticketSolucionado);
        this.router.post('/downloadExcelFile', ticketsController_1.default.downloadExcelFile);
    }
}
const ticketsRoutes = new TicketsRoutes();
exports.default = ticketsRoutes.router;
