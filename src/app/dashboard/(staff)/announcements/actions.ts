"use server"

import { getAnnouncements, GetAnnouncementsParams } from "@/src/utils/getAnnouncements";

export async function fetchAnnouncementsAction(params: GetAnnouncementsParams) {
  return await getAnnouncements(params)
}

