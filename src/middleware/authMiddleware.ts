import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { Role, UserStatus } from "../../generated/prisma";
import { validate as isUUID } from "uuid";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string | null;
        email: string;
        role: Role;
      };
    }
  }
}

export const authMiddleware = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session?.user?.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userId = String(session.user.id);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });

      if (!dbUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (dbUser.status === UserStatus.BANNED) {
        return res.status(403).json({
          success: false,
          message: "Account is banned",
        });
      }

      if (dbUser.status === UserStatus.INACTIVE) {
        return res.status(403).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      if (allowedRoles.length && !allowedRoles.includes(dbUser.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: insufficient permissions",
        });
      }

      req.user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      };

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  };
};
