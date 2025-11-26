import { Checkbox } from "@/src/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { AdviseeItem } from "./advisees-table";
import { Badge } from "@/src/components/ui/badge";
import {
  BadgeCheck,
  CircleAlert,
  CircleCheckBig,
  EllipsisVertical,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import DeleteConfirmDialog from "../../admin/accounts/delete-dialog";
import { toast } from "sonner";
import { deleteAdviseeAction } from "@/src/app/dashboard/(faculty)/advisees/actions";
import AcceptAdviseeDialog from "./accept-dialog";
import { AdviseeDrawer } from "./advisee-update-drawer";

export interface GetAdviseeColumnProps {
  fetchData: () => Promise<void>;
}

const getAdviseeColumns = ({
  fetchData,
}: GetAdviseeColumnProps): ColumnDef<AdviseeItem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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

  // Student column
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original.student;
      return (
        <div>
          {student.firstName} {student.lastName}
          <div className="text-xs text-muted-foreground">{student.email}</div>
        </div>
      );
    },
  },

  // Members column
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const members = row.original.members || [];

      if (members.length === 0)
        return (
          <span className="text-muted-foreground text-sm">No members</span>
        );

      return (
        <div className="flex flex-wrap gap-1">
          {members.map((m) => (
            <Badge key={m.id} variant="secondary" className="text-xs px-2 py-1">
              {m.member?.firstName} {m.member?.lastName}
            </Badge>
          ))}
        </div>
      );
    },
  },

  // Status
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = {
        ACTIVE: {
          icon: <CircleCheckBig className="text-green-500" />,
          color: "text-green-500 border border-green-500",
        },
        PENDING: {
          icon: <CircleAlert className="text-yellow-500" />,
          color: "text-yellow-500 border border-yellow-500",
        },
        INACTIVE: {
          icon: <CircleAlert className="text-gray-400" />,
          color: "text-gray-400 border border-gray-400",
        },
      };

      const { icon, color } = config[status] || config.INACTIVE;

      return (
        <Badge
          variant="outline"
          className={`flex items-center gap-1 px-2 py-0.5 text-sm font-medium ${color}`}
        >
          {icon}
          <span className="capitalize">{status.toLowerCase()}</span>
        </Badge>
      );
    },
  },

  // Date
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-sm text-muted-foreground">
          {isNaN(date.getTime())
            ? "Invalid"
            : date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
        </span>
      );
    },
  },

  // Actions
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <EllipsisVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* Accept */}
          <DropdownMenuItem asChild>
            <AcceptAdviseeDialog
              itemName={`${row.original.student.firstName} ${row.original.student.lastName}`}
              adviseeId={row.original.id}
              onConfirm={fetchData}
            >
              <Button
                variant="ghost"
                className="flex items-center justify-start w-full text-green-600 hover:bg-green-50"
                disabled={
                  row.original.status === "ACTIVE" ||
                  row.original.status === "INACTIVE"
                }
              >
                <BadgeCheck size={16} />
                Accept
              </Button>
            </AcceptAdviseeDialog>
          </DropdownMenuItem>

          {/* View */}
          <DropdownMenuItem asChild>
            <AdviseeDrawer item={row.original} fetchData={fetchData} />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete */}
          <DropdownMenuItem asChild>
            <DeleteConfirmDialog
              itemName={`${row.original.student.firstName} ${row.original.student.lastName}`}
              onConfirm={async () => {
                const res = await deleteAdviseeAction(row.original.id);
                if (res.success) {
                  toast.success("Advisee deleted successfully");
                  await fetchData();
                } else {
                  toast.error("Failed to delete advisee");
                }
              }}
            >
              <Button
                variant="ghost"
                className="flex items-center justify-start w-full text-red-600 hover:bg-red-50"
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

export default getAdviseeColumns;
