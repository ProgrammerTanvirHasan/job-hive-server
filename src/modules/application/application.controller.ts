import { Request, Response } from "express";
import { applicationService } from "./application.service";
import { applicationSchema } from "./validation";

const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const apps = await applicationService.getApplications(userId);

    return res.status(200).json({
      success: true,
      data: apps,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
////////////////////////////
const getNotAppliedJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const jobs = await applicationService.getNotAppliedJobs(userId);

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecruiterApplicants = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await applicationService.getRecruiterApplicants(userId, role);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};
//.........................................................//

const applyJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { jobId, coverLetter, resume } = req.body;

    // ================= VALIDATION =================
    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume URL is required",
      });
    }

    const result = await applicationService.applyJob(userId, Number(jobId), {
      resume,
      coverLetter: coverLetter || "",
    });

    return res.json({
      success: true,
      message: "Application submitted successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getApplicantsByJob = async (req: Request, res: Response) => {
  try {
    const recruiterId = req.user?.id;
    const jobId = Number(req.params.jobId);

    if (!recruiterId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await applicationService.getApplicantsByJob(
      recruiterId,
      jobId,
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const scheduleInterviewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { status, interviewDate, message } = req.body;

    const result = await applicationService.scheduleInterviewService(Number(id), {
      status,
      interviewDate,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to schedule interview",
    });
  }
};

const deleteApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const applicationId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await applicationService.deleteApplication(
      userId,
      applicationId,
    );

    return res.json({
      success: true,
      message: "Application deleted successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const applicationController = {
  deleteApplication,
  getApplications,
  getRecruiterApplicants,
  getNotAppliedJobs,
  applyJob,
  getApplicantsByJob,
  scheduleInterviewController,
};
