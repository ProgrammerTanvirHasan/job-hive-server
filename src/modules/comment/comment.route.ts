import express from "express";
import { commentController } from "./comment.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma";

const router = express.Router();

router.post("/", authMiddleware(Role.USER), commentController.createComment);
router.get("/:jobId", commentController.getComments);

export const commentRouter = router;
