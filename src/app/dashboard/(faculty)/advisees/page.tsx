import { auth } from "@/lib/auth";
import AdviseesTable from "@/src/components/shared/dashboard/faculty/advisees/advisees-table";
import TableSkeleton from "@/src/components/shared/dashboard/skeleton/table-skeleton";
import { getAdvisees } from "@/src/utils/getAdvisees";
import { Suspense } from "react";

const AdviseesPage = async () => {
  const session = await auth();
  const adviserId = session?.user?.id;

  const initialData = await getAdvisees({
    page: 1,
    pageSize: 10,
    adviserId,
  });

  return (
    <div className="lg:p-6 space-y-6">
      <h1 className="text-xl font-bold tracking-wide">My Advisees</h1>

      <Suspense fallback={<TableSkeleton rows={10} />}>
        <AdviseesTable initialData={initialData} adviserId={adviserId} />
      </Suspense>
    </div>
  );
};
export default AdviseesPage;
