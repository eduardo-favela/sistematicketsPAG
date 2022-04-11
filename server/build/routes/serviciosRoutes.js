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
        ////////////////////////////ACTIVIDADES////////////////////////////
        this.router.get('/getActividades', serviciosController_1.default.getActividades);
        this.router.get('/getActividadesHShtsTable', serviciosController_1.default.getActividadesHShtsTable);
        this.router.post('/setActividad', serviciosController_1.default.setActividad);
        this.router.post('/setActividadHShts', serviciosController_1.default.setActividadHShts);
        this.router.post('/unSetActividadHShts', serviciosController_1.default.unSetActividadHShts);
        this.router.post('/updateActividad', serviciosController_1.default.updateActividad);
        this.router.post('/updateActivShts', serviciosController_1.default.updateActivShts);
        this.router.post('/getShtsNoAsignados', serviciosController_1.default.getShtsNoAsignados);
        this.router.post('/getShtsAsignados', serviciosController_1.default.getShtsAsignados);
        this.router.post('/getActividadesForTicket', serviciosController_1.default.getActividadesForTicket);
        ///////////////////////////////////////////////////////////////////
        /////////////////////////////SERVICIOS/////////////////////////////
        this.router.get('/getServicios', serviciosController_1.default.getServicios);
        this.router.get('/getServiciosTable', serviciosController_1.default.getServiciosTable);
        this.router.post('/getServiciosDepto', serviciosController_1.default.getServiciosDepto);
        this.router.post('/setServicio', serviciosController_1.default.setServicio);
        this.router.post('/updateServicio', serviciosController_1.default.updateServicio);
        this.router.post('/setServicioHTS', serviciosController_1.default.setServicioHTS);
        this.router.post('/unsetTipoServicio', serviciosController_1.default.unsetServicioHTS);
        //////////////RUTAS PARA USO DE LA PANTALLA DE TICKETS//////////////
        this.router.post('/getTServicioForTicket', serviciosController_1.default.getTServicioForTicket);
        ///////////////////////////////////////////////////////////////////
        ////////////////////////TIPOS DE SERVICIO//////////////////////////
        this.router.get('/getDeptosSistemas', serviciosController_1.default.getDeptosSistemas);
        this.router.get('/getTiposServicioTable', serviciosController_1.default.getTiposServicioTable);
        this.router.post('/getTiposServicios', serviciosController_1.default.getTiposServicios);
        this.router.post('/setTipoServicio', serviciosController_1.default.setTipoServicio);
        this.router.post('/updateTipoServicio', serviciosController_1.default.updateTipoServicio);
        this.router.post('/getTiposServicioAsignados', serviciosController_1.default.getTiposServicioAsignados);
        ///////////////////////////////////////////////////////////////////
    }
}
const serviciosRoutes = new ServiciosRoutes();
exports.default = serviciosRoutes.router;
