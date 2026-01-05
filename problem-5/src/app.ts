import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { logger } from "./middleware/LoggerMiddleware";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(logger);
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/", routes);

export default app;
