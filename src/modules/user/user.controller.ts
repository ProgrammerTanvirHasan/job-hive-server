import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { Role } from "../../../generated/prisma";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["ACTIVE", "BANNED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be ACTIVE or BANNED",
      });
    }
    const result = await userService.updateUserStatus(id as string, status);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const userId = String(req.user?.id);
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (role !== Role.ADMIN && userId !== id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const user = await userService.getUserById(id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // 🔥 session based
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const updatedUser = await userService.updateUserService(userId, req.body);

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// const deleteUserController = async (req: Request, res: Response) => {
//   try {
//     const id = String(req.params.id);

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid user ID",
//       });
//     }

//     await userService.deleteUser(id);

//     return res.status(200).json({
//       success: true,
//       message: "User deactivated successfully",
//     });
//   } catch (error: any) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const restoreUserController = async (req: Request, res: Response) => {
//   try {
//     const id = String(req.params.id);

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid user ID",
//       });
//     }

//     const user = await userService.restoreUser(id);

//     return res.status(200).json({
//       success: true,
//       message: "User restored successfully",
//       data: user,
//     });
//   } catch (error: any) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const userController = {
  getAllUsers,
  getUser,
  updateUserStatus,
  updateUser,
};
