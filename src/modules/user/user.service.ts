import { UserStatus } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status === UserStatus.BANNED) {
    throw new Error("User is banned");
  }

  return user;
};

const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BANNED",
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUserService = async (userId: string, payload: any) => {
  const { name, email } = payload;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(name && { name }),
      ...(email && { email }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return updatedUser;
};
// const deleteUser = async (id: string) => {
//   const existingUser = await prisma.user.findUnique({
//     where: { id },
//   });

//   if (!existingUser) {
//     throw new Error("User not found");
//   }

//   if (existingUser.status === UserStatus.INACTIVE) {
//     throw new Error("User already deactivated");
//   }

//   return prisma.user.update({
//     where: { id },
//     data: {
//       status: UserStatus.INACTIVE,
//     },
//   });
// };

// const restoreUser = async (id: string) => {
//   const user = await prisma.user.findUnique({ where: { id } });

//   if (!user) throw new Error("User not found");

//   if (user.status === UserStatus.ACTIVE) {
//     throw new Error("User already active");
//   }

//   return prisma.user.update({
//     where: { id },
//     data: { status: UserStatus.ACTIVE },
//   });
// };

export const userService = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserService,
};
