import express from "express";
import { paymentController } from "./payment.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma";

const router = express.Router();

/* ================= INIT ================= */
router.post("/init", authMiddleware(Role.USER), paymentController.initPayment);

/* ================= INIT PAID APPLICATION ================= */

router.post(
  "/init-paid-application",
  authMiddleware(Role.USER),
  paymentController.initPaidApplication,
);
/* ================= CALLBACKS — SSLCommerz POSTs to these ================= */
router.post("/success", paymentController.success);
router.post("/fail", paymentController.fail);
router.post("/ipn", paymentController.ipn);

export const paymentRouter = router;
