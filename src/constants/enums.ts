export const AnnouncementStatus = {
  VISIBLE: "VISIBLE",
  HIDDEN: "HIDDEN",
} as const;

export type AnnouncementStatus =
  (typeof AnnouncementStatus)[keyof typeof AnnouncementStatus];
