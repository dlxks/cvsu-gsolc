"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import DataPagination from "@/src/components/shared/data-pagination";
import Link from "next/link";
import { useDebounce } from "@/src/hooks/use-debounce";
import TableLoading from "../../../table-loading";
import { fetchAnnouncementsAction } from "@/src/app/dashboard/(staff)/announcements/actions";
import { formatDate, truncateText } from "@/src/lib/utils";

interface CreatorProps {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  files: string[];
  createdAt: Date;
  updatedAt?: Date | null;
  creator: CreatorProps;
}

interface AnnouncementResponse {
  items: AnnouncementItem[];
  page: number;
  pageSize: number;
  pages: number;
}

interface AnnouncementProps {
  staffId?: string;
  initialData: AnnouncementResponse;
}

const AnnouncementsList = ({ staffId, initialData }: AnnouncementProps) => {
  const [page, setPage] = useState(initialData.page || 1);
  const [pageSize, setPageSize] = useState(initialData.pageSize || 10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [data, setData] = useState<AnnouncementItem[]>(initialData.items || []);
  const [totalPages, setTotalPages] = useState(initialData.pages || 1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (
      opts?: Partial<{ page: number; pageSize: number; search: string }>
    ) => {
      setIsLoading(true);
      try {
        const res = await fetchAnnouncementsAction({
          page: opts?.page ?? page,
          pageSize: opts?.pageSize ?? pageSize,
          search: opts?.search || debouncedSearch,
        });

        setData(res.items);
        setTotalPages(res.pages);
        setPage(res.page);
      } catch (e) {
        console.error("Error fetching users:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, debouncedSearch]
  );

  useEffect(() => {
    fetchData({ search: debouncedSearch });
  }, [debouncedSearch, page, pageSize, fetchData]);

  const text = truncateText(
    "This will have the contents of the card.This will have the contents the contents of the card.",
    200
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Search bar */}
          <Input
            placeholder="Search..."
            className="max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Right controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export data */}
          <Button variant="outline">Export All</Button>

          <Button asChild variant="default">
            <Link href="/dashboard/announcements/create">
              Create Announcement
            </Link>
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="py-6 flex flex-wrap items-center justify-center gap-2">
        {isLoading ? (
          <TableLoading rows={10} />
        ) : data.length > 0 ? (
          data.map((a) => (
            <Card className="w-full md:max-w-2xs" key={a.id}>
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
                <CardDescription>
                  Author: {a.creator.firstName} {a.creator.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent className="truncate" title={text}>
                {/* content here */}
              </CardContent>
              <CardFooter>
                <CardDescription>
                  Date posted: {formatDate(a.createdAt)}
                </CardDescription>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No announcements found.</p>
        )}
      </div>

      {/* Pagination controls */}
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
  );
};

export default AnnouncementsList;
