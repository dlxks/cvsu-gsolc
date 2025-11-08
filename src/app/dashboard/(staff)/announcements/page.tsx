import { auth } from "@/lib/auth";
import AnnouncementsList from "@/src/components/shared/dashboard/staff/announcements/announcements-list";
import { getAnnouncements } from "@/src/utils/getAnnouncements";

const AnnouncementsPage = async () => {
  const session = await auth();
  const staffId = session?.user?.id;

  const initialData = await getAnnouncements({
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-wide">Announcements</h1>

      <AnnouncementsList initialData={initialData} staffId={staffId} />
    </div>
  );
};

export default AnnouncementsPage;
