import { auth } from "@/lib/auth";
import BackButton from "@/src/components/shared/dashboard/nav/back-button";
import AnnouncementForm from "@/src/components/shared/dashboard/staff/announcements/create-announcement-form";

const CreateAnnouncement = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <BackButton label="Return to announcements" />
      <h1 className="text-xl font-bold tracking-wide">Create Announcement</h1>

      <AnnouncementForm createdBy={userId} />
    </>
  );
};

export default CreateAnnouncement;
