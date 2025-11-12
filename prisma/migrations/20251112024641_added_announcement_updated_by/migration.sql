-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "updatedBy" TEXT;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
