import { Role } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const getApplications = async (userId: string) => {
  return prisma.application.findMany({
    where: { userId },
    include: {
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
//////////////////////

const getNotAppliedJobs = async (userId: string) => {
  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        {
          status: "APPROVED",
        },
        {
          applications: {
            none: {
              userId,
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs;
};
const getApplicationsByJob = async (
  userId: string,
  jobId: number,
  role: Role,
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new Error("Job not found");

  if (role !== Role.ADMIN && job.userId !== userId) {
    throw new Error("Not authorized");
  }

  return prisma.application.findMany({
    where: { jobId },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
//...................................................//
const applyJob = async (userId: string, jobId: number, data: any) => {
  const exist = await prisma.application.findUnique({
    where: {
      userId_jobId: { userId, jobId },
    },
  });

  if (exist) {
    throw new Error("You already applied to this job");
  }

  return prisma.application.create({
    data: {
      userId,
      jobId,
      resume: data.resume, // ✅ correct path
      coverLetter: data.coverLetter ?? "", // ✅ NEVER NULL
    },
  });
};

const getApplicantsByJob = async (recruiterId: string, jobId: number) => {
  // ✅ Step 1: check job ownership
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.userId !== recruiterId) {
    throw new Error("You are not allowed to view these applicants");
  }

  // ✅ Step 2: get applicants
  const applicants = await prisma.application.findMany({
    where: { jobId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applicants;
};

const deleteApplication = async (userId: string, id: number) => {
  // 1️⃣ Find application
  const application = await prisma.application.findUnique({
    where: { id },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  // 2️⃣ Ownership check (security)
  if (application.userId !== userId) {
    throw new Error("You are not allowed to delete this application");
  }

  // 3️⃣ Delete application
  return prisma.application.delete({
    where: { id },
  });
};

export const applicationService = {
  applyJob,
  getApplications,
  getApplicationsByJob,
  getNotAppliedJobs,
  getApplicantsByJob,
  deleteApplication,
};
