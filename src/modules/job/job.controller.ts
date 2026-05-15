import { Request, Response } from "express";
import { jobService } from "./job.service";

const createJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const job = await jobService.createJob(req.body, userId);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.getAllJobs();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const jobs = await jobService.getMyJobs(userId);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getActiveJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.getActiveJobs();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getPendingJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.getPendingJobs();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getPremiumJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.getPremiumJobs();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUrgentJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.getUrgentJobs();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getJobsByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;

    const jobs = await jobService.getJobsByCategory(category);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getJobById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const job = await jobService.getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const job = await jobService.updateJob(
      Number(req.params?.id),
      req.body,
      userId,
      role,
    );

    return res.status(200).json({
      success: true,
      message: "Updated",
      data: job,
    });
  } catch (err: any) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await jobService.deleteJob(Number(req.params.id), userId, role);

    return res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const approveJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.approveJob(Number(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Approved",
      data: job,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const rejectJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.rejectJob(
      Number(req.params.id),
      req.body.rejectionReason,
    );

    return res.status(200).json({
      success: true,
      message: "Rejected",
      data: job,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getTrendingCategories = async (req: Request, res: Response) => {
  try {
    const categories = await jobService.getTrendingCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch categories",
    });
  }
};
export const jobController = {
  createJob,
  getAllJobs,
  getActiveJobs,
  getPendingJobs,
  getPremiumJobs,
  getUrgentJobs,
  getJobsByCategory,
  getJobById,
  updateJob,
  deleteJob,
  approveJob,
  rejectJob,
  getMyJobs,
  getTrendingCategories,
};
