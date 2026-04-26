import { prisma } from "../../lib/prisma";

const createComment = async (
  userId: string,
  jobId: number,
  content: string,
  parentId?: number,
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      throw new Error("Parent comment not found");
    }

    if (parent.jobId !== jobId) {
      throw new Error("Invalid parent comment");
    }
  }

  return prisma.comment.create({
    data: {
      userId,
      jobId,
      content,
      parentId: parentId ?? null,
    },
    include: {
      user: true,
    },
  });
};

const getCommentsByJob = async (jobId: number) => {
  return prisma.comment.findMany({
    where: {
      jobId,
      parentId: null,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const commentService = {
  createComment,
  getCommentsByJob,
};
