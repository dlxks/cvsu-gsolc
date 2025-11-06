import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const Home = async () => {
  const session = await auth();
  let user = null;

  if (session) {
    user = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
    });
  }

  if (session?.user) {
    const userInfo = session.user;
    console.log(userInfo.role);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className=" rounded-lg p-6 max-w-xl w-full">
        <h1 className="text-xl mb-4 text-center">Home Page</h1>
      </div>
    </div>
  );
};

export default Home;
