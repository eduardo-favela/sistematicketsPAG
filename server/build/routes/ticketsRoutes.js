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
        this.router.get('/getTicketsForTable', ticketsController_1.default.getTicketsForTable);
        this.router.post('/setTicket', ticketsController_1.default.setTicket);
    }
}
const ticketsRoutes = new TicketsRoutes();
exports.default = ticketsRoutes.router;
