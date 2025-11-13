"use server"

import prisma from "@/lib/prisma"
import { getUsers, GetUsersParams } from "@/src/utils/getUsers"
import { revalidatePath } from "next/cache"

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */
export type UserRole = "STUDENT" | "STAFF" | "FACULTY"

export interface CreateUserProps {
  firstName: string
  lastName: string
  email: string
  image?: string
  providerAccountId?: string
  role: UserRole
}

export interface UpdateUserFormProps extends FormData {
  studentId?: string
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
}

type DeleteResult = {
  success: boolean;
  message?: string;
};

/* -------------------------------------------------------------------------- */
/*                                   HELPER                                   */
/* -------------------------------------------------------------------------- */
function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "/dashboard/students"
    case "STAFF":
      return "/dashboard/staff"
    case "FACULTY":
      return "/dashboard/faculties"
    default:
      return "/dashboard"
  }
}

function getFormValue(fd: FormData, key: string, required = false): string | null {
  const value = fd.get(key)
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed === "") return required ? "" : null
  return trimmed
}

export async function fetchUsersAction(params: GetUsersParams) {
  return await getUsers(params);
}

/* -------------------------------------------------------------------------- */
/*                                CREATE USER                                 */
/* -------------------------------------------------------------------------- */
export async function createUserAction(params: CreateUserProps) {
  const { firstName, lastName, email, image, role } = params

  if (!firstName || !lastName || !email || !role) {
    throw new Error("Missing required fields")
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, message: "User already exists" }
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role,
        image:
          image ||
          `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}+${lastName}`,

        emailVerified: new Date()
      }
    })

    revalidatePath(getDashboardPath(role))

    return { success: true, user: newUser }
  } catch (error) {
    console.error(`Error creating ${role.toLocaleLowerCase()}:`, error)
    return { success: false, message: `Failed to create ${role.toLocaleLowerCase()}` }
  }
}


/* -------------------------------------------------------------------------- */
/*                                DELETE USER                                 */
/* -------------------------------------------------------------------------- */
export async function deleteUserAction(
  id: string,
  role: UserRole
): Promise<DeleteResult> {
  try {
    await prisma.user.delete({ where: { id } });

    const path = getDashboardPath(role) ?? "/dashboard";
    revalidatePath(path);

    return { success: true, message: `The ${role.toLowerCase} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting ${role.toLowerCase()}:`, error);
    return { success: false, message: `Failed to delete ${role.toLowerCase()}` };
  }
}

/* -------------------------------------------------------------------------- */
/*                                UPDATE USER                                 */
/* -------------------------------------------------------------------------- */
export async function updateUserAction(id: string, formData: FormData, role: UserRole) {
  const studentId = getFormValue(formData, "studentId", false);
  const firstName = getFormValue(formData, "firstName", true);
  const middleName = getFormValue(formData, "middleName", false);
  const lastName = getFormValue(formData, "lastName", true);
  const email = getFormValue(formData, "email", true);
  const phoneNumber = getFormValue(formData, "phoneNumber", false);

  if (!firstName || !lastName || !email) {
    throw new Error("Missing required fields: first name, last name, or email.");
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        studentId: studentId || null,
        firstName,
        middleName: middleName || null,
        lastName,
        email,
        phoneNumber: phoneNumber || null,
      },
    });

    revalidatePath(getDashboardPath(role));
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${role.toLowerCase()}:`, error);
    throw new Error(`Failed to update ${role.toLowerCase()} information`);
  }
}