/*
  Warnings:

  - You are about to drop the `_AdviseeMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_AdviseeMembers" DROP CONSTRAINT "_AdviseeMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AdviseeMembers" DROP CONSTRAINT "_AdviseeMembers_B_fkey";

-- DropTable
DROP TABLE "public"."_AdviseeMembers";

-- CreateTable
CREATE TABLE "advisee_members" (
    "id" TEXT NOT NULL,
    "adviseeId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advisee_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advisee_members_adviseeId_memberId_key" ON "advisee_members"("adviseeId", "memberId");

-- AddForeignKey
ALTER TABLE "advisee_members" ADD CONSTRAINT "advisee_members_adviseeId_fkey" FOREIGN KEY ("adviseeId") REFERENCES "advisees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisee_members" ADD CONSTRAINT "advisee_members_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
