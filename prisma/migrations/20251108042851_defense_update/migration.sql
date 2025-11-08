/*
  Warnings:

  - You are about to drop the `_DefenseFacultyMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_DefenseFacultyMembers" DROP CONSTRAINT "_DefenseFacultyMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DefenseFacultyMembers" DROP CONSTRAINT "_DefenseFacultyMembers_B_fkey";

-- DropTable
DROP TABLE "public"."_DefenseFacultyMembers";

-- CreateTable
CREATE TABLE "defense_members" (
    "id" TEXT NOT NULL,
    "defenseId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "role" "MemberType" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "defense_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "defense_members_defenseId_memberId_key" ON "defense_members"("defenseId", "memberId");

-- AddForeignKey
ALTER TABLE "defense_members" ADD CONSTRAINT "defense_members_defenseId_fkey" FOREIGN KEY ("defenseId") REFERENCES "defense_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_members" ADD CONSTRAINT "defense_members_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
