import { JobStatus, Role } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createJob = async (data: any, userId: string) => {
  return prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      company: data.company,
      location: data.location,

      category: data.category?.trim().toLowerCase(),

      salary: data.salary || null,
      isPaid: data.isPaid,
      price: data.price ?? null,

      requirements: data.requirements || [],
      qualifications: data.qualifications || [],
      benefits: data.benefits || [],

      applyDeadline: data.applyDeadline ? new Date(data.applyDeadline) : null,

      userId,
      status: JobStatus.PENDING,
    },
  });
};

const getAllJobs = async () => {
  return prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getMyJobs = async (userId: string) => {
  return prisma.job.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getActiveJobs = async () => {
  return prisma.job.findMany({
    where: { status: JobStatus.APPROVED },
  });
};

const getPendingJobs = async () => {
  return prisma.job.findMany({
    where: { status: JobStatus.PENDING },
  });
};

const getPremiumJobs = async () => {
  return prisma.job.findMany({
    where: {
      status: JobStatus.APPROVED,
      price: { gt: 0 },
    },
  });
};

const getUrgentJobs = async () => {
  const now = new Date();
  const next = new Date(Date.now() + 72 * 60 * 60 * 1000);

  return prisma.job.findMany({
    where: {
      status: JobStatus.APPROVED,
      applyDeadline: { gte: now, lte: next },
    },
  });
};

const getJobById = async (id: number) => {
  return prisma.job.findUnique({ where: { id } });
};

const getJobsByCategory = async (category?: string) => {
  if (!category) return [];

  const q = category.trim().toLowerCase();

  return prisma.job.findMany({
    where: {
      status: JobStatus.APPROVED,
      category: {
        contains: q,
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateJob = async (
  id: number,
  data: any,
  userId: string,
  role: string,
) => {
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) throw new Error("Job not found");

  const isOwner = job.userId === String(userId);
  const isAdmin = role === Role.ADMIN;

  if (!isAdmin && !isOwner) {
    throw new Error("Not allowed");
  }

  return prisma.job.update({
    where: { id },
    data: {
      title: data.title || undefined,
      description: data.description || undefined,
      company: data.company || undefined,
      location: data.location || undefined,
      category: data.category || undefined,
      salary: data.salary ? Number(data.salary) : undefined,
      applyDeadline: data.applyDeadline
        ? new Date(data.applyDeadline)
        : undefined,
    },
  });
};

const deleteJob = async (id: number, userId: string, role: string) => {
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) throw new Error("Job not found");
  if (role !== Role.ADMIN && job.userId !== userId)
    throw new Error("Not allowed");

  return prisma.job.delete({ where: { id } });
};

const approveJob = async (id: number) => {
  return prisma.$transaction(async (tx) => {
    const job = await tx.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    const updatedJob = await tx.job.update({
      where: { id },
      data: { status: JobStatus.APPROVED },
    });

    await tx.user.update({
      where: { id: job.userId },
      data: {
        role: Role.RECRUITER,
      },
    });

    return updatedJob;
  });
};

const rejectJob = async (id: number, reason: string) => {
  return prisma.job.update({
    where: { id },
    data: {
      status: JobStatus.REJECTED,
      rejectionReason: reason,
    },
  });
};
const getTrendingCategories = async () => {
  const jobs = await prisma.job.findMany({
    select: {
      category: true,
    },
    where: {
      status: "APPROVED",
    },
  });


  const categories = [...new Set(jobs.map((job) => job.category))];

  return categories;
};
export const jobService = {
  createJob,
  getAllJobs,
  getActiveJobs,
  getPendingJobs,
  getPremiumJobs,
  getUrgentJobs,
  getJobById,
  getJobsByCategory,
  updateJob,
  deleteJob,
  approveJob,
  rejectJob,
  getMyJobs,
  getTrendingCategories,
};
