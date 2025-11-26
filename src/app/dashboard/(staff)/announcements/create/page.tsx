import { auth } from "@/lib/auth";
import BackButton from "@/src/components/shared/dashboard/nav/back-button";
import AnnouncementForm from "@/src/components/shared/dashboard/staff/announcements/create-announcement-form";

export default async function CreateAnnouncementPage() {
  const session = await auth();
  const createdBy = session?.user?.id;

  return (
    <>
      <BackButton label="Return to announcements" />

      <h1 className="text-xl font-bold tracking-wide mb-6">
        Create Announcement
      </h1>

      <AnnouncementForm createdBy={createdBy} />
    </>
  );
}
