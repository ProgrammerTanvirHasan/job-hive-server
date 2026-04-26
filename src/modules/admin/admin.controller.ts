import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const data = await adminService.getDashboardStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
///////////////////////

const deleteCompanyJobs = async (req: Request, res: Response) => {
  try {
    const { company } = req.params;

    const companyName = Array.isArray(company) ? company[0] : company;

    const result = await adminService.deleteJobsByCompany(
      companyName,
      req.user?.role as string,
    );

    return res.status(200).json({
      success: true,
      message: `All jobs from ${companyName} deleted successfully`,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getStatistics();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch dashboard stats",
    });
  }
};
const getAllApplications = async (req: Request, res: Response) => {
  try {
    const data = await adminService.getAllApplications();

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllPayments = async (req: Request, res: Response) => {
  try {
    const data = await adminService.getAllPayments();

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const adminController = {
  getDashboardStats,
  deleteCompanyJobs,
  getStatistics,
  getAllApplications,
  getAllPayments,
};
