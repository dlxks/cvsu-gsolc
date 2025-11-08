"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
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
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Download,
  RefreshCcw,
  Settings2,
} from "lucide-react";

import { useDebounce } from "@/src/hooks/use-debounce";
import DataPagination from "../../../data-pagination";
import TableLoading from "../../../table-loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import { fetchAdviseesAction } from "@/src/app/dashboard/(faculty)/advisees/actions";
import { AdviseeStatus } from "@/src/app/generated/prisma/enums";
import getAdviseeColumns from "./advisee-columns";
import AddAdviseeDialog from "./add-advisee-dialog";

export interface AdviseeItem {
  id: string;
  adviserId: string;
  studentId: string;
  status: AdviseeStatus;
  createdAt: Date;
  updatedAt: Date | null;
  adviser: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  student: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
  };
  members: {
    id: string;
    createdAt: Date;
    adviseeId: string;
    memberId: string;
    member: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      phoneNumber: string | null;
    };
  }[];
}

export interface AdviseesResponse {
  items: AdviseeItem[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

interface AdviseeTableProps {
  initialData: AdviseesResponse;
  adviserId: string | undefined;
}

const AdviseesTable: React.FC<AdviseeTableProps> = ({
  initialData,
  adviserId,
}) => {
  const [tableState, setTableState] = React.useState(initialData);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { items: data, page, pageSize, pages } = tableState;

  /** Fetch data from server */
  const fetchData = React.useCallback(
    async (
      opts?: Partial<{ page: number; pageSize: number; search: string }>
    ) => {
      if (!adviserId) return;

      setIsLoading(true);
      try {
        const res = await fetchAdviseesAction({
          page: opts?.page ?? page,
          pageSize: opts?.pageSize ?? pageSize,
          search: opts?.search ?? debouncedSearch,
          adviserId,
        });
        setTableState(res);
      } catch (error) {
        console.error("Failed to fetch advisees:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [adviserId, debouncedSearch, page, pageSize]
  );

  /** Re-fetch when search changes */
  React.useEffect(() => {
    fetchData({ page: 1, search: debouncedSearch });
  }, [debouncedSearch, fetchData]);

  const columns = React.useMemo(
    () => getAdviseeColumns({ fetchData }),
    [fetchData]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Search Input */}
        <Input
          placeholder="Search advisees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline">Export Selected</Button>
            {adviserId && (
              <AddAdviseeDialog
                adviserId={adviserId}
                onAdded={() => fetchData()}
              />
            )}
          </div>

          {/* Dropdown (mobile controls) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <span className="flex lg:hidden">Controls</span>
                <Settings2 size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 space-y-2 p-2">
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => fetchData()}
                disabled={isLoading}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>

              <div className="border-t border-muted pt-2">
                <Label className="text-xs text-muted-foreground">
                  Visible Columns
                </Label>
                {table
                  .getAllLeafColumns()
                  .filter((col) => col.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(v) => column.toggleVisibility(!!v)}
                      className="capitalize"
                    >
                      {String(column.columnDef.header)}
                    </DropdownMenuCheckboxItem>
                  ))}
              </div>

              <div className="flex flex-col lg:hidden gap-2">
                <Button variant="outline" className="w-full">
                  <Download size={16} />
                  Export Selected
                </Button>
                {adviserId && (
                  <AddAdviseeDialog
                    adviserId={adviserId}
                    onAdded={() => fetchData()}
                  />
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableLoading rows={10} />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();

                    return (
                      <TableHead
                        key={header.id}
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        className={
                          canSort ? "cursor-pointer select-none" : undefined
                        }
                      >
                        <span className="flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" && <ArrowUpWideNarrow size={14} />}
                          {sorted === "desc" && (
                            <ArrowDownWideNarrow size={14} />
                          )}
                        </span>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

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
                    className="text-muted-foreground text-center py-6"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <DataPagination
          page={page}
          pageSize={pageSize}
          totalPages={pages}
          onPageChange={(newPage) => fetchData({ page: newPage })}
          onPageSizeChange={(newSize) =>
            fetchData({ page: 1, pageSize: newSize })
          }
          disabled={isLoading}
        />
      )}
    </div>
  );
};

export default AdviseesTable;
