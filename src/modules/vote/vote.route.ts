import express from "express";
import { voteController } from "./vote.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma";

const router = express.Router();

router.post("/:jobId", authMiddleware(Role.USER), voteController.voteJob);
router.get("/:jobId", voteController.getVoteCount);

export const voteRouter = router;
