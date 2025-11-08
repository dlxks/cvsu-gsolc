"use server"

import prisma from "@/lib/prisma";
import { AdviseeStatus } from "@/src/app/generated/prisma/enums";
import { GetAdviseeParams, getAdvisees } from "@/src/utils/getAdvisees";
import { revalidatePath, revalidateTag } from "next/cache";

/* -------------------------------------------------
   Helper: revalidateAdvisees
---------------------------------------------------*/
async function revalidateAdvisees() {
  try { revalidateTag?.("advisees", "default"); } catch { }
  try { revalidatePath?.("/dashboard/advisees"); } catch { }
}

/* -------------------------------------------------
   Server action: fetchAdviseesAction
   (Client-friendly wrapper)
---------------------------------------------------*/
export async function fetchAdviseesAction(params: GetAdviseeParams) {
  return getAdvisees(params);
}

/* -------------------------------------------------
   Faculty list for multi-select
---------------------------------------------------*/
export async function getFacultyServer() {
  const faculty = await prisma.user.findMany({
    where: { role: { in: ["FACULTY", "STAFF"] } },
    select: { id: true, firstName: true, middleName: true, lastName: true },
    orderBy: { lastName: "asc" },
  });

  return faculty.map((f) => ({
    id: f.id,
    name: [f.firstName, f.middleName, f.lastName].filter(Boolean).join(" "),
  }));
}

/* -------------------------------------------------
   Students search (for MultiSelect)
---------------------------------------------------*/
export async function getStudentsServer(query: string) {
  return searchStudents(query || "", 20);
}

export async function searchStudents(query: string, limit = 10) {
  const q = query.trim();

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      ...(q && {
        OR: [
          { studentId: { contains: q, mode: "insensitive" } },
          { firstName: { contains: q, mode: "insensitive" } },
          { middleName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    select: { id: true, studentId: true, firstName: true, middleName: true, lastName: true },
    orderBy: { lastName: "asc" },
    take: limit,
  });

  return students.map((s) => ({
    id: s.id,
    name: `${s.studentId ?? ""} — ${[s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ")}`,
  }));
}


/* -------------------------------------------------
   🔹 Add Advisee
---------------------------------------------------*/
export async function addAdvisee({
  adviserId,
  studentId,
  memberIds = [],
}: {
  adviserId: string;
  studentId: string;
  memberIds?: string[];
}) {
  if (!adviserId || !studentId) {
    return { success: false, message: "Missing adviser or student." };
  }

  try {
    // 🧭 Ensure target user is a STUDENT
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { role: true },
    });

    if (!student || student.role !== "STUDENT") {
      return { success: false, message: "Selected user is not a student." };
    }

    // 🧩 Prevent duplicate adviser relationships
    const existing = await prisma.advisee.findMany({
      where: { studentId },
      select: { status: true },
    });

    if (existing.some((r) => r.status === AdviseeStatus.ACTIVE)) {
      return { success: false, message: "Student already has an active adviser." };
    }

    if (existing.some((r) => r.status === AdviseeStatus.PENDING)) {
      return { success: false, message: "Student already has a pending adviser request." };
    }

    // Create Advisee with members
    const advisee = await prisma.advisee.create({
      data: {
        adviserId,
        studentId,
        status: AdviseeStatus.PENDING,
        members: {
          create: memberIds.map((memberId) => ({
            memberId,
          })),
        },
      },
      include: {
        adviser: true,
        student: true,
        members: {
          include: { member: true },
        },
      },
    });

    await revalidateAdvisees();

    return { success: true, message: "Advisee request created.", advisee };
  } catch (error) {
    console.error("Error adding advisee:", error);
    return { success: false, message: "Failed to create advisee." };
  }
}

/* ------------------------------------------------------------------
   UPDATE ADVISEE ACTION
------------------------------------------------------------------- */
export async function updateAdviseeAction(id: string, formData: FormData) {
  try {
    const adviserId = formData.get("adviserId") as string;
    const studentId = formData.get("studentId") as string;
    const status = formData.get("status") as AdviseeStatus;
    const memberIds = formData.getAll("memberIds") as string[];

    // --- Validation ---
    if (!id || !adviserId || !studentId || !status) {
      return { success: false, message: "Missing required fields." };
    }

    // --- Update advisee record ---
    const updatedAdvisee = await prisma.advisee.update({
      where: { id },
      data: {
        adviserId,
        studentId,
        status,
        updatedAt: new Date(),

        // Update related members: replace all members
        members: {
          deleteMany: {}, // remove existing
          create: memberIds.map((memberId) => ({
            memberId,
          })),
        },
      },
      include: {
        student: true,
        members: { include: { member: true } },
      },
    });

    // --- Optional cache invalidation (remove if not using ISR) ---
    try {
      revalidatePath("/dashboard/advisees");
    } catch (e) {
      console.warn("Path revalidation skipped:", e);
    }

    return {
      success: true,
      message: "Advisee updated successfully.",
      data: updatedAdvisee,
    };
  } catch (error: any) {
    console.error("❌ updateAdviseeAction error:", error);
    return {
      success: false,
      message: "Failed to update advisee.",
    };
  }
}

/* -------------------------------------------------
   Update Advisee Status
---------------------------------------------------*/
export async function updateAdviseeStatusAction(id: string, status: AdviseeStatus) {
  try {
    await prisma.advisee.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });

    return { success: true, message: "Status updated." };
  } catch (error) {
    console.error("Advisee status error:", error);
    return { success: false, message: "Failed to update status." };
  }
}

/* -------------------------------------------------
   Delete Advisee (remove)
---------------------------------------------------*/
export async function deleteAdviseeAction(id: string) {
  try {
    // Delete will remove relation rows for implicit many-to-many
    await prisma.advisee.delete({
      where: { id },
    });

    return { success: true, message: "Advisee removed." };
  } catch (error) {
    console.error("deleteAdviseeAction error:", error);
    return { success: false, message: "Failed to delete advisee." };
  }
}
