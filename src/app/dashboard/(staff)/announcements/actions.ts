"use server";

import prisma from "@/lib/prisma";
import { AnnouncementFormValues } from "@/src/components/shared/dashboard/staff/announcements/create-announcement-form";
import { getAnnouncements, GetAnnouncementsParams } from "@/src/utils/getAnnouncements";

// --------------------------
// Fetch Announcements
// --------------------------
export async function fetchAnnouncementsAction(params: GetAnnouncementsParams) {
  return await getAnnouncements(params);
}

// --------------------------
// Create Announcement
// --------------------------
export async function createAnnouncementAction(
  values: AnnouncementFormValues,
  createdBy: string
) {
  try {
    const content = values.content ?? "";

    const announcement = await prisma.announcement.create({
      data: {
        title: values.title,
        status: values.status,
        expiry: values.expiry ? new Date(values.expiry) : null,
        content,
        createdBy,
      },
    });

    return {
      success: true,
      message: "Announcement created successfully.",
      announcement,
    };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { success: false, message: "Failed to create announcement." };
  }
}

// --------------------------
// Update Announcement
// --------------------------
export async function updateAnnouncementAction(
  id: string,
  values: AnnouncementFormValues,
  updatedBy: string
) {
  try {
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: "Announcement not found." };
    }

    const content = values.content ?? "";

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        title: values.title,
        status: values.status,
        expiry: values.expiry ? new Date(values.expiry) : null,
        content,
        updatedAt: new Date(),
        updatedBy,
      },
    });

    return {
      success: true,
      message: "Announcement updated successfully.",
      announcement: updated,
    };
  } catch (error) {
    console.error("Error updating announcement:", error);
    return { success: false, message: "Failed to update announcement." };
  }
}
