import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";

import { errorHandler } from "./middlewares/error-handler.js";
import { notFound } from "./middlewares/not-found.js";

import { apiRouter } from "./routes/index.js";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

app.use(
  morgan(
    env.NODE_ENV === "production"
      ? "combined"
      : "dev",
  ),
);

app.use(
  "/api",
  apiRouter,
);

app.use(notFound);
app.use(errorHandler);


app.listen(env.PORT, () => {
      console.log(
        `Server berjalan di http://localhost:${env.PORT}`,
      );
});