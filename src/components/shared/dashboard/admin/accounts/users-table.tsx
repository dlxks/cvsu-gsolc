"use client";

import { useDebounce } from "@/src/hooks/use-debounce";
import { exportExcelFile } from "@/src/utils/exportExcel";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import getUserColumns from "./user-columns";
import { fetchUsersAction } from "@/src/app/dashboard/(admin)/students/actions";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import {
  ArrowUp,
  CirclePlus,
  Download,
  RefreshCcw,
  Settings2,
} from "lucide-react";
import { AddUserDialog } from "./add-user-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import DataPagination from "../../../data-pagination";
import TableSkeleton from "../../skeleton/table-skeleton";

export interface UserItem {
  id: string;
  studentId?: string | null;
  staffId?: string | null;
  firstName: string | null;
  middleName?: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  session?: { expires: string }[] | null;
  createdAt?: string | null;
  role?: string | null;
}

export interface UsersResponse {
  items: UserItem[];
  page: number;
  pageSize: number;
  pages: number;
}

export interface UsersTableProps {
  role: "STUDENT" | "STAFF" | "FACULTY";
  initialData: UsersResponse;
}

const UsersTable = ({ role, initialData }: UsersTableProps) => {
  const [data, setData] = React.useState(initialData.items || []);
  const [page, setPage] = React.useState(initialData.page || 1);
  const [pageSize, setPageSize] = React.useState(initialData.pageSize || 10);
  const [totalPages, setTotalPages] = React.useState(initialData.pages || 1);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  //  Reusable fetch
  const fetchData = React.useCallback(
    async (
      opts?: Partial<{ page: number; pageSize: number; search: string }>
    ) => {
      setIsLoading(true);
      try {
        const res = await fetchUsersAction({
          page: opts?.page ?? page,
          pageSize: opts?.pageSize ?? pageSize,
          search: opts?.search ?? debouncedSearch,
          filters: { role },
        });

        const normalized = res.items.map((item: any) => ({
          ...item,
          createdAt:
            typeof item.createdAt === "string"
              ? item.createdAt
              : item.createdAt?.toISOString?.() ?? "",
        }));

        setData(normalized);
        setTotalPages(res.pages);
        setPage(res.page);
      } catch (e) {
        console.error("Error fetching users:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, debouncedSearch, role]
  );

  React.useEffect(() => {
    fetchData({ search: debouncedSearch });
  }, [debouncedSearch, page, pageSize, role, fetchData]);

  const columns = React.useMemo(
    () => getUserColumns({ fetchData, role }),
    [fetchData, role]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  const handleExport = async (selectedOnly = false) => {
    const exportData = selectedOnly
      ? table.getSelectedRowModel().rows.map((r) => r.original)
      : data;
    await exportExcelFile(exportData, `${role}`, role.toLowerCase());
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <Input
            placeholder={`Search ${role.toLowerCase()}s...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            {/* Export button */}
            {Object.keys(rowSelection).length > 0 ? (
              <Button onClick={() => handleExport(true)} variant="outline">
                Export Selected
              </Button>
            ) : (
              <Button onClick={() => handleExport(false)} variant="outline">
                Export All
              </Button>
            )}

            {/* Add user dialog */}
            <AddUserDialog role={role} onAdd={() => fetchData()} />
          </div>

          {/* Custom controls */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <span className="flex lg:hidden">Controls</span> <Settings2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 space-y-2 p-2">
              <div className="space-y-1">
                {/* Refresh button */}
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() =>
                    fetchData({ page, pageSize, search: debouncedSearch })
                  }
                  disabled={isLoading}
                >
                  <RefreshCcw />
                  Refresh Data
                </Button>

                {/* Visibible columns */}
                <div className="border-t border-muted pt-2">
                  <Label className="text-xs text-muted-foreground">
                    Visible Columns
                  </Label>
                  {table
                    .getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(v) => column.toggleVisibility(!!v)}
                        className="capitalize"
                      >
                        {column.columnDef.header as string}
                      </DropdownMenuCheckboxItem>
                    ))}
                </div>

                <div className="flex flex-col lg:hidden items-center gap-2">
                  {/* Export button */}
                  {Object.keys(rowSelection).length > 0 ? (
                    <Button
                      onClick={() => handleExport(true)}
                      variant="outline"
                      className="w-full flex items-center"
                    >
                      <Download size={16} />
                      Export Selected
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleExport(false)}
                      variant="outline"
                      className="w-full flex items-center"
                    >
                      <Download size={16} />
                      Export All
                    </Button>
                  )}

                  {/* Add user dialog */}
                  <AddUserDialog role={role} onAdd={() => fetchData()} />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Contents */}
      {isLoading ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <TableSkeleton rows={10} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            {/* Table Header */}
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : undefined
                      }
                    >
                      <span className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" && (
                          <ArrowUp size={14} />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ArrowUp size={14} />
                        )}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between">
        <div>{Object.keys(rowSelection).length} selected</div>
        {totalPages > 1 && (
          <DataPagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={(newPage) => fetchData({ page: newPage })}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              fetchData({ page: 1, pageSize: newSize });
            }}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default UsersTable;
