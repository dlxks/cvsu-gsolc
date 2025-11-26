import { UserItem } from "./users-table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Trash2 } from "lucide-react";
import DeleteConfirmDialog from "./delete-dialog";
import {
  deleteUserAction,
  UserRole,
} from "@/src/app/dashboard/(admin)/students/actions";
import { toast } from "sonner";
import UserDrawer from "./user-drawer";

export interface GetUserColumnsProps {
  fetchData: () => Promise<void>;
  role?: "STUDENT" | "STAFF" | "FACULTY";
}

const getUserColumns = ({
  fetchData,
  role = "STUDENT",
}: GetUserColumnsProps): ColumnDef<UserItem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && undefined)
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all rows"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  role === "STUDENT"
    ? {
        accessorKey: "studentId",
        header: "Student ID",
        cell: ({ row }) => (
          <div className="font-mono text-sm">
            {row.original.studentId || "N/A"}
          </div>
        ),
      }
    : {
        accessorKey: "staffId",
        header: "ID Number",
        cell: ({ row }) => (
          <div className="font-mono text-sm">
            {row.original.staffId || "N/A"}
          </div>
        ),
      },

  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="truncate max-w-[220px]">
        {row.original.email || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => <div>{row.original.phoneNumber || "N/A"}</div>,
  },
  {
    accessorKey: "session",
    header: "Status",
    cell: ({ row }) => {
      const sessions = Array.isArray(row.original.session)
        ? row.original.session
        : [];
      const isActive = sessions.some(
        (s) => s?.expires && new Date(s.expires) > new Date()
      );
      return (
        <Badge
          variant="secondary"
          className={
            isActive
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem asChild>
            <UserDrawer item={row.original} role={role} fetchData={fetchData} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <DeleteConfirmDialog
              itemName={`${row.original.firstName} ${row.original.lastName}`}
              onConfirm={async () => {
                if (!row.original.role) {
                  toast.error("Role is missing. Cannot delete user.");
                  return;
                }

                const res = await deleteUserAction(
                  row.original.id,
                  row.original.role as UserRole
                );
                if (res.success) {
                  toast.success(`${row.original.role} deleted successfully`);
                  await fetchData();
                } else {
                  toast.error(res.message);
                }
              }}
            >
              <Button
                variant="ghost"
                className="flex items-center w-full justify-start text-red-600 hover:bg-red-50 pl-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </DeleteConfirmDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default getUserColumns;
