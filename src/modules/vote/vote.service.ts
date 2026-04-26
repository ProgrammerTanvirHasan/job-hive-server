import { prisma } from "../../lib/prisma";

const voteJob = async (userId: string, jobId: number, type: "UP" | "DOWN") => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      recruiterId: true,
      status: true,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.status !== "APPROVED") {
    throw new Error("You can only vote approved jobs");
  }

  if (job.recruiterId === userId) {
    throw new Error("You cannot vote your own job");
  }

  return prisma.vote.upsert({
    where: {
      userId_jobId: { userId, jobId },
    },
    update: {
      type,
    },
    create: {
      userId,
      jobId,
      type,
    },
  });
};

const getVoteCount = async (jobId: number) => {
  const upVotes = await prisma.vote.count({
    where: {
      jobId,
      type: "UP",
    },
  });

  const downVotes = await prisma.vote.count({
    where: {
      jobId,
      type: "DOWN",
    },
  });

  return {
    upVotes,
    downVotes,
    total: upVotes - downVotes,
  };
};

export const voteService = {
  voteJob,
  getVoteCount,
};
