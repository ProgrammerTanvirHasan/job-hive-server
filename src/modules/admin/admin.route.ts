import { Role } from "../../../generated/prisma";
import { authMiddleware } from "../../middleware/authMiddleware";
import express from "express";
import { adminController } from "./admin.controller";
const router = express.Router();
router.get(
  "/dashboard",
  authMiddleware(Role.ADMIN),
  adminController.getDashboardStats,
);
/////////////////////
router.delete(
  "/company/:company",
  authMiddleware(Role.ADMIN),
  adminController.deleteCompanyJobs,
);
router.get("/stats", adminController.getStatistics);

router.get(
  "/applications",
  authMiddleware(Role.ADMIN),
  adminController.getAllApplications,
);

router.get(
  "/payments",
  authMiddleware(Role.ADMIN),
  adminController.getAllPayments,
);
/////////////////
export const adminRouter = router;
