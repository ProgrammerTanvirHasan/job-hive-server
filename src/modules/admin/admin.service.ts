import { Role } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const getDashboardStats = async () => {
  const [totalUsers, totalJobs, pendingJobs] = await prisma.$transaction([
    prisma.user.count(),
    prisma.job.count(),
    prisma.job.count({
      where: {
        status: "PENDING",
      },
    }),
  ]);

  return {
    totalUsers,
    totalJobs,
    pendingJobs,
  };
};
//////////////////////////////
const deleteJobsByCompany = async (company: string, role: string) => {
  if (role !== Role.ADMIN) {
    throw new Error("Not authorized");
  }

  const deleted = await prisma.job.deleteMany({
    where: {
      company,
    },
  });

  if (deleted.count === 0) {
    throw new Error("No jobs found for this company");
  }

  return deleted;
};

const getStatistics = async () => {
  const [
    totalUsers,
    totalJobs,
    totalApplications,
    approvedJobs,
    uniqueCompanies,
  ] = await prisma.$transaction([
    prisma.user.count(),

    prisma.job.count(),

    prisma.application.count(),

    prisma.job.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.job.findMany({
      distinct: ["company"],
      select: {
        company: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalJobs,
    totalApplications,
    approvedJobs,
    totalCompanies: uniqueCompanies.length,
  };
};

const getAllApplications = async () => {
  return prisma.application.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllPayments = async () => {
  return prisma.payment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const adminService = {
  getDashboardStats,
  deleteJobsByCompany,
  getStatistics,
  getAllApplications,
  getAllPayments,
};
