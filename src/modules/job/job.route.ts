import express from "express";
import { jobController } from "./job.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma";
import { createJobSchema } from "./validation";
import { validate } from "../../middleware/validate";

const router = express.Router();

router.get("/active", jobController.getActiveJobs);
router.get("/pending", jobController.getPendingJobs);
router.get("/premium", jobController.getPremiumJobs);
router.get("/urgent", jobController.getUrgentJobs);
router.get("/all", jobController.getAllJobs);
router.get(
  "/my-posts",
  authMiddleware(Role.RECRUITER),
  jobController.getMyJobs,
);

router.get("/search", jobController.getJobsByCategory);
router.get("/trending-categories", jobController.getTrendingCategories);

router.get("/:id", jobController.getJobById);

router.post(
  "/",
  validate(createJobSchema),
  authMiddleware(Role.USER, Role.RECRUITER, Role.ADMIN),
  jobController.createJob,
);

router.patch(
  "/:id",
  authMiddleware(Role.RECRUITER, Role.ADMIN),
  jobController.updateJob,
);

router.delete(
  "/:id",
  authMiddleware(Role.RECRUITER, Role.ADMIN),
  jobController.deleteJob,
);

router.put(
  "/admin/:id/approve",
  authMiddleware(Role.ADMIN),
  jobController.approveJob,
);

router.put(
  "/admin/:id/reject",
  authMiddleware(Role.ADMIN),
  jobController.rejectJob,
);

export const jobRouter = router;
