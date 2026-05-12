-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'INTERVIEW';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "recruiterMessage" TEXT;
