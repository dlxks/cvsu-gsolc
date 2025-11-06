"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

export interface DataPaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
  disabled?: boolean;
}

const DataPagination = ({
  page,
  totalPages,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  className,
  disabled = false,
}: DataPaginationProps) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div
      className={`flex items-center justify-between gap-4 ${className || ""}`}
    >
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <Label>Page size:</Label>
        <Select
          value={String(pageSize)}
          onValueChange={(val) => onPageSizeChange(Number(val))}
          disabled={disabled}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={!canPrev || disabled}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft size={16} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={!canPrev || disabled}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="text-sm">
          Page {page} of {totalPages || 1}
        </div>

        <Button
          variant="outline"
          size="icon"
          disabled={!canNext || disabled}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={!canNext || disabled}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default DataPagination;
