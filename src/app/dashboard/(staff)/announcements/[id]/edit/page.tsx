import { notFound } from "next/navigation";
import { getAnnouncementById } from "@/src/utils/getAnnouncements";
import AnnouncementForm from "@/src/components/shared/dashboard/staff/announcements/create-announcement-form";
import BackButton from "@/src/components/shared/dashboard/nav/back-button";

export default async function EditAnnouncementPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);

  if (!announcement) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <BackButton label="Return to announcements" />

      <h1 className="text-2xl font-bold mb-6">Edit Announcement</h1>

      <AnnouncementForm
        initialData={announcement}
        createdBy={announcement.creator.id}
      />
    </div>
  );
}
