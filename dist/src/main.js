"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (origin.includes('localhost')) {
                callback(null, true);
                return;
            }
            const frontendUrl = process.env.FRONTEND_URL;
            if (frontendUrl && origin === frontendUrl) {
                callback(null, true);
                return;
            }
            const rootDomain = process.env.ROOT_DOMAIN;
            if (rootDomain && origin.endsWith(rootDomain)) {
                callback(null, true);
                return;
            }
            console.warn(`[CORS] Blocked origin: ${origin}`);
            callback(null, false);
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'));
    const port = process.env.PORT ?? 4000;
    await app.listen(port);
    console.log(`Backend is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map