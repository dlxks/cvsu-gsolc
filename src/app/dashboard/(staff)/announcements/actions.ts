"use server";

import prisma from "@/lib/prisma";
import { AnnouncementFormValues } from "@/src/components/shared/dashboard/staff/announcements/create-announcement-form";
import { getAnnouncements, GetAnnouncementsParams } from "@/src/utils/getAnnouncements";
import { success } from "zod";

// Fetch announcements
export async function fetchAnnouncementsAction(params: GetAnnouncementsParams) {
  return await getAnnouncements(params);
}

// Create announcement
export async function createAnnouncementAction(values: AnnouncementFormValues, createdBy: string) {
  try {
    const announcement = await prisma.announcement.create({
      data: {
        title: values.title,
        status: values.status,
        expiry: values.expiry ? new Date(values.expiry) : null,
        content: values.content ?? "",
        createdBy,
      },
    });

    return { success: true, announcement };
  } catch (error) {
    console.error("Create announcement error:", error);
    return { success: false, message: "Failed to create announcement." };
  }
}

// Update announcement
export async function updateAnnouncementAction(
  id: string,
  values: AnnouncementFormValues,
  updatedBy: string
) {
  try {
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Announcement not found." };

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        title: values.title,
        status: values.status,
        expiry: values.expiry ? new Date(values.expiry) : null,
        content: values.content ?? "",
        updatedAt: new Date(),
        updatedBy,
      },
    });

    return { success: true, announcement: updated };
  } catch (error) {
    console.error("Update announcement error:", error);
    return { success: false, message: "Failed to update announcement." };
  }
}

// Delete announcement
export async function deleteAnnouncementAction(id: string) {
  try {
    const deleted = await prisma.announcement.delete({ where: { id } })
    return {
      success: true,
      message: "Announcement deleted successfully.",
      deleted
    }
  } catch (error: any) {
    console.error("Delete announcement error: ", error)

    return {
      success: false,
      message: error?.message ?? "Failed to delete announcement.",
    }
  }

}