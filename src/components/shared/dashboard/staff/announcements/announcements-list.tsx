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
import {
  deleteAnnouncementAction,
  fetchAnnouncementsAction,
} from "@/src/app/dashboard/(staff)/announcements/actions";
import { formatDate, truncateText } from "@/src/lib/utils";
import TableSkeleton from "../../skeleton/table-skeleton";
import { Edit2, EllipsisVertical, Trash2 } from "lucide-react";
import DeleteConfirmDialog from "../../admin/accounts/delete-dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

// Utility to strip HTML tags from string for truncation
function stripHtml(html: string): string {
  if (!html) return "";
  if (typeof window !== "undefined" && window.document) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  // fallback for server-side: remove tags by regex (simple)
  return html.replace(/<[^>]+>/g, "");
}

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
      <div className="flex flex-wrap items-center justify-between">
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
          {/* <Button variant="outline">Export All</Button> */}

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
          <TableSkeleton rows={10} />
        ) : data.length > 0 ? (
          data.map((a) => (
            <Card
              className="w-full md:max-w-2xs shadow-md hover:glass transition-all duration-150 bg-white/30 backdrop-blur-sm hover:shadow-lg hover:bg-white/50 hover:backdrop-blur-md hover:scale-101"
              key={a.id}
            >
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
                <CardDescription>
                  Author: {a.creator.firstName} {a.creator.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative max-h-24 overflow-hidden">
                {/* Render the content as HTML safely */}
                <div
                  className="tiptap prose prose-sm sm:prose lg:prose-lg"
                  dangerouslySetInnerHTML={{ __html: a.content }}
                />
                {/* Fade overlay */}
                <div className="absolute bottom-0 left-0 w-full h-8 bg-linear-to-t from-white to-transparent pointer-events-none" />
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <CardDescription className="italic">
                  Date posted: {formatDate(a.createdAt)}
                </CardDescription>
                <div className="flex items-center justify-between gap-1">
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
                    <DropdownMenuContent className="flex flex-col">
                      <Button asChild variant="ghost">
                        <Link
                          href={`/dashboard/announcements/${a.id}/edit`}
                          className="flex items-center justify-start w-full"
                        >
                          <Edit2 />
                          Update
                        </Link>
                      </Button>

                      <DeleteConfirmDialog
                        itemName={a.title}
                        onConfirm={async () => {
                          const res = await deleteAnnouncementAction(a.id);
                          if (res.success) {
                            toast.success(`Announcement deleted successfully`);
                            await fetchData();
                          } else {
                            toast.error(res.message);
                          }
                        }}
                      >
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start w-full text-red-600 hover:bg-red-50"
                        >
                          <Trash2 />
                          Remove
                        </Button>
                      </DeleteConfirmDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
