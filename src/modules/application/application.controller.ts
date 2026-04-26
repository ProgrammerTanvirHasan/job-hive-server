import { Request, Response } from "express";
import { applicationService } from "./application.service";
import { applicationSchema } from "./validation";

// const applyJob = async (req: Request, res: Response) => {
//   try {
//     const parsedData = applicationSchema.parse(req.body);

//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const result = await applicationService.applyJob(
//       userId,
//       parsedData.jobId,
//       parsedData.resume,
//       parsedData.coverLetter,
//     );

//     return res.status(201).json({
//       success: true,
//       message: "Applied successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

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

const getApplicationsByJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const jobId = Number(req.params.jobId);
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const data = await applicationService.getApplicationsByJob(
      userId,
      jobId,
      role,
    );

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
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { jobId, coverLetter } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "CV required" });
    }

    // ✅ ALWAYS correct path
    const resumePath = `/uploads/${req.file.filename}`;

    const result = await applicationService.applyJob(userId, Number(jobId), {
      resume: resumePath,
      coverLetter: coverLetter || "", 
    });

    res.json({
      success: true,
      message: "Application submitted successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
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
  getApplicationsByJob,
  getNotAppliedJobs,
  applyJob,
  getApplicantsByJob,
};
