"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/src/components/ui/drawer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { useIsMobile } from "@/src/hooks/use-mobile";
import { AdviseeItem } from "./advisees-table";
import { MultiSelect } from "@/src/components/ui/multi-select";
import {
  getFacultyServer,
  updateAdviseeAction,
} from "@/src/app/dashboard/(faculty)/advisees/actions";
import { Eye } from "lucide-react";

export type AdviseeStatus = "PENDING" | "ACTIVE" | "INACTIVE";

interface AdviseeDrawerProps {
  item: AdviseeItem;
  fetchData: () => Promise<void>;
}

export const AdviseeDrawer: React.FC<AdviseeDrawerProps> = ({
  item,
  fetchData,
}) => {
  const isMobile = useIsMobile();

  // UI state
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Data states
  const [status, setStatus] = React.useState<AdviseeStatus>(item.status);
  const [facultyOptions, setFacultyOptions] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>(
    item.members?.map((m) => m.member?.id || "") || []
  );

  // Fetch faculty list once
  React.useEffect(() => {
    (async () => {
      try {
        const faculty = await getFacultyServer();
        setFacultyOptions(
          faculty.map((f) => ({
            label: f.name,
            value: f.id,
          }))
        );
      } catch (err) {
        console.error("Failed to load faculty:", err);
        toast.error("Unable to load faculty list.");
      }
    })();
  }, []);

  // --- Handle Save ---
  const handleSaveChanges = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("adviserId", item.adviserId);
      formData.append("studentId", item.studentId);
      formData.append("status", status);
      selectedMembers.forEach((id) => formData.append("memberIds", id));

      const res = await updateAdviseeAction(item.id, formData);

      if (!res.success) {
        toast.error(res.message || "Failed to update advisee.");
        return;
      }

      toast.success("Advisee updated successfully.");
      await fetchData();
      setIsOpen(false);
    } catch (error) {
      console.error("Update advisee error:", error);
      toast.error("Something went wrong while saving changes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-start w-full"
        >
          <Eye size={16} />
          View
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md mx-auto">
        <div className="mx-auto w-full p-4">
          {/* Header */}
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold">
              {item.student.firstName} {item.student.lastName}
            </DrawerTitle>
            <DrawerDescription>
              View and update advisee details.
            </DrawerDescription>
          </DrawerHeader>

          {/* Body */}
          <div className="px-4 py-4 space-y-5">
            {/* Members MultiSelect */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Members (Faculty/Staff)
              </p>
              <MultiSelect
                options={facultyOptions}
                value={selectedMembers}
                onValueChange={setSelectedMembers}
                placeholder="Select members..."
                maxCount={3}
                searchable
              />
            </div>

            {/* Status Select */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as AdviseeStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <DrawerFooter>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
