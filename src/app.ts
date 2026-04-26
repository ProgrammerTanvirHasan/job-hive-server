import express, { Application, Request, Response } from "express";

import cors from "cors";
import { applicationRouter } from "./modules/application/application.route";

import { commentRouter } from "./modules/comment/comment.route";
import { jobRouter } from "./modules/job/job.route";
import { paymentRouter } from "./modules/payment/payment.route";
import { userRouter } from "./modules/user/user.route";
import { voteRouter } from "./modules/vote/vote.route";

import { notFound } from "./middleware/notFound";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import errorHandler from "./middleware/globalErrorHandler";
import { adminRouter } from "./modules/admin/admin.route";

const app: Application = express();

const frontendOrigin =
  process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api/application", applicationRouter);
app.use("/api/comment", commentRouter);
app.use("/api/job", jobRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/user", userRouter);
app.use("/api/vote", voteRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!!");
});

app.use(notFound);

app.use(errorHandler);

export default app;
