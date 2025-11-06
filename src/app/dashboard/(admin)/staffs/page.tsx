import UsersTable from "@/src/components/shared/dashboard/admin/accounts/users-table";
import TableSkeleton from "@/src/components/shared/dashboard/skeleton/table-skeleton";
import { requireRole } from "@/src/lib/requireRole";
import { getUsers } from "@/src/utils/getUsers";
import { Suspense } from "react";

const StudentsPage = async () => {
  await requireRole(["ADMIN"]);

  const initialData = await getUsers({
    filters: { role: "STAFF" },
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="lg:p-6 space-y-6">
      <h3 className="text-xl font-bold tracking-wide">Staff List</h3>

      <Suspense fallback={<TableSkeleton rows={10} />}>
        <UsersTable role="STAFF" initialData={initialData} />
      </Suspense>
    </div>
  );
};

export default StudentsPage;
