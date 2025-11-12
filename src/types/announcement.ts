import { AnnouncementStatus } from "../constants/enums";

export interface AnnouncementTypes {
  id: string;
  title: string;
  content: string;
  files: string[];
  status: AnnouncementStatus;
  expiry?: string | Date | null;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}