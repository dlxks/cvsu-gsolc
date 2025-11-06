/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staffId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'FACULTY', 'STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "DefenseCategory" AS ENUM ('TITLE', 'FINAL');

-- CreateEnum
CREATE TYPE "DefenseStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('SYLLABUS_ACCEPTANCE_FORM', 'TOS_MIDTERM', 'TOS_FINALS', 'RUBRICS_MIDTERM', 'RUBRICS_FINALS', 'EXAMINATIONS_MIDTERM', 'EXAMINATIONS_FINALS', 'GRADING_SHEET', 'RECORD', 'STUDENT_OUTPUT', 'CLASS_RECORD', 'PORTFOLIO');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('NONE', 'SUBMITTED', 'REVISED', 'APPROVED');

-- CreateEnum
CREATE TYPE "AdviseeStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "AnnouncementStatus" AS ENUM ('VISIBLE', 'HIDDEN');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "staffId" TEXT,
ADD COLUMN     "studentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "files" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_schedules" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "category" "DefenseCategory" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "status" "DefenseStatus" NOT NULL DEFAULT 'PENDING',
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "defense_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_requirements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "defenseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "defense_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_required_documents" (
    "id" TEXT NOT NULL,
    "defenseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "DefenseCategory" NOT NULL,
    "description" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "defense_required_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advisees" (
    "id" TEXT NOT NULL,
    "adviserId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AdviseeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "advisees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_documents" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "remarks" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "faculty_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DefenseFacultyMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DefenseFacultyMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AdviseeMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdviseeMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "faculty_documents_facultyId_category_key" ON "faculty_documents"("facultyId", "category");

-- CreateIndex
CREATE INDEX "_DefenseFacultyMembers_B_index" ON "_DefenseFacultyMembers"("B");

-- CreateIndex
CREATE INDEX "_AdviseeMembers_B_index" ON "_AdviseeMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "users_studentId_key" ON "users"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "users_staffId_key" ON "users"("staffId");

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_schedules" ADD CONSTRAINT "defense_schedules_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_schedules" ADD CONSTRAINT "defense_schedules_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_schedules" ADD CONSTRAINT "defense_schedules_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_requirements" ADD CONSTRAINT "defense_requirements_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_requirements" ADD CONSTRAINT "defense_requirements_defenseId_fkey" FOREIGN KEY ("defenseId") REFERENCES "defense_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_required_documents" ADD CONSTRAINT "defense_required_documents_defenseId_fkey" FOREIGN KEY ("defenseId") REFERENCES "defense_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisees" ADD CONSTRAINT "advisees_adviserId_fkey" FOREIGN KEY ("adviserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisees" ADD CONSTRAINT "advisees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_documents" ADD CONSTRAINT "faculty_documents_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefenseFacultyMembers" ADD CONSTRAINT "_DefenseFacultyMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "defense_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefenseFacultyMembers" ADD CONSTRAINT "_DefenseFacultyMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdviseeMembers" ADD CONSTRAINT "_AdviseeMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "advisees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdviseeMembers" ADD CONSTRAINT "_AdviseeMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
