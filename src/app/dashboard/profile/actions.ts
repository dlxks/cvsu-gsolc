"use server"

import z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { profileFormSchema } from "@/src/schemas/userProfileFormSchema";

export async function updateInformation(formData: z.infer<typeof profileFormSchema>) {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error("Not authenticated.")
    }

    const userId = session?.user?.id
    const role = session?.user?.role?.toUpperCase()

    const data = profileFormSchema.parse(formData)

    let updateData: any = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
    }

    if (role === "STUDENT") {
      updateData.studentId = data.idNumber
    } else if (["STAFF", "FACULTY", "ADMIN"].includes(role)) {
      updateData.staffId = data.idNumber
    }
    else {
      throw new Error(`Unknown role: ${role}`)
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    revalidatePath("/dashboard/profile")

    return { success: true, message: "Profile updated successfully." }
  } catch (error: any) {
    console.error("Error updating profile information: ", error)
    return { success: false, message: "Failed to update profile." }
  }
}