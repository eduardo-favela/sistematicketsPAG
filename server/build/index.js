"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const ticketsRoutes_1 = __importDefault(require("./routes/ticketsRoutes"));
const usuariosRoutes_1 = __importDefault(require("./routes/usuariosRoutes"));
const serviciosRoutes_1 = __importDefault(require("./routes/serviciosRoutes"));
const equipoSistemas_1 = __importDefault(require("./routes/equipoSistemas"));
const equiposRoutes_1 = __importDefault(require("./routes/equiposRoutes"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3005);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(body_parser_1.default.json({ limit: '50mb' }));
        this.app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
    }
    routes() {
        this.app.use('/api/login', loginRoutes_1.default);
        this.app.use('/api/tickets', ticketsRoutes_1.default);
        this.app.use('/api/usuarios', usuariosRoutes_1.default);
        this.app.use('/api/servicios', serviciosRoutes_1.default);
        this.app.use('/api/equipoSistemas', equipoSistemas_1.default);
        this.app.use('/api/equipos', equiposRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
