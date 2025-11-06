import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BackButton from "@/src/components/shared/dashboard/nav/back-button";
import UserProfileForm, {
  ProfileProps,
} from "@/src/components/shared/dashboard/profile/user-profile-form";
import { nullToUndefined } from "@/src/lib/utils";

const UserProfilePage = async () => {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: {
      id: true,
      studentId: true,
      staffId: true,
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
    },
  });
  const sanitizedUser = user ? (nullToUndefined(user) as ProfileProps) : null;

  return (
    <div>
      <BackButton label="Return to previous page" className="cursor-pointer" />
      <div className="max-w-5xl mx-auto lg:p-6 space-y-6 ">
        <h1 className="text-xl font-bold">Update User Information</h1>

        <UserProfileForm item={sanitizedUser} />
      </div>
    </div>
  );
};

export default UserProfilePage;
