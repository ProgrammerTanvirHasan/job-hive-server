import { Request, Response } from "express";

import { voteSchema } from "./validation";
import { voteService } from "./vote.service";

const voteJob = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;
    const jobId = Number(req.params.jobId);

    if (isNaN(jobId) || jobId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }
    const parsed = voteSchema.parse({
      jobId,
      type: req.body.type,
    });

    const vote = await voteService.voteJob(userId, parsed.jobId, parsed.type);

    return res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
      data: vote,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.errors
        ? error.errors.map((e: any) => e.message)
        : error.message,
    });
  }
};

const getVoteCount = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.jobId);

    if (isNaN(jobId) || jobId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const result = await voteService.getVoteCount(jobId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const voteController = {
  voteJob,
  getVoteCount,
};
