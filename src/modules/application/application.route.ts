import express from "express";
import { applicationController } from "./application.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma";
import { upload } from "../../middleware/upload";
import { applicationSchema } from "./validation";
import { validate } from "../../middleware/validate";

const router = express.Router();
// router.post("/", authMiddleware(Role.USER), applicationController.applyJob);
router.get(
  "/",
  authMiddleware(Role.RECRUITER, Role.USER),
  applicationController.getApplications,
);
///////////////

router.get(
  "/not-applied",
  authMiddleware(Role.USER),
  applicationController.getNotAppliedJobs,
);
/////////////////////////////
router.get(
  "/job/:jobId",
  authMiddleware(Role.RECRUITER, Role.ADMIN),
  applicationController.getApplicationsByJob,
);

//.................................................................//
router.post(
  "/apply",
  authMiddleware(Role.USER),
  upload.single("resume"),
  validate(applicationSchema),
  applicationController.applyJob,
);
router.get(
  "/job/:jobId/applicants",
  authMiddleware(Role.RECRUITER),
  applicationController.getApplicantsByJob,
);

router.delete(
  "/:id",
  authMiddleware(Role.USER),
  applicationController.deleteApplication,
);
export const applicationRouter = router;
