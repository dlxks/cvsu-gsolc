// src/components/yourpath/add-advisee-dialog.tsx
"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";
import {
  addAdvisee,
  getFacultyServer,
  getStudentsServer,
} from "@/src/app/dashboard/(faculty)/advisees/actions";
import { toast } from "sonner";
import { MultiSelect } from "@/src/components/ui/multi-select";

type UserOption = { id: string; name: string };

export default function AddAdviseeDialog({
  adviserId,
  onAdded,
}: {
  adviserId: string;
  onAdded?: () => void;
}) {
  // state
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingLists, setLoadingLists] = React.useState(false);

  const [students, setStudents] = React.useState<UserOption[]>([]);
  const [faculty, setFaculty] = React.useState<UserOption[]>([]);

  // MultiSelect uses array-of-values even for single select
  const [selectedStudent, setSelectedStudent] = React.useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);

  // Load students & faculty when dialog opens (preload)
  React.useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoadingLists(true);
      try {
        // Fetch initial students (empty query) and faculty in parallel
        const [studentList, facultyList] = await Promise.all([
          getStudentsServer(""), // server now returns initial results when empty
          getFacultyServer(),
        ]);

        if (!mounted) return;
        setStudents(studentList || []);
        setFaculty(facultyList || []);
      } catch (err) {
        console.error("Failed to load lists:", err);
        toast.error("Failed to load students or faculty.");
      } finally {
        if (mounted) setLoadingLists(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open]);

  // Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudent.length) {
      toast.error("Please select a student.");
      return;
    }

    setLoading(true);
    try {
      // selectedStudent[0] is the student id string
      if (!adviserId) {
        toast.error("Adviser ID is missing");
        return;
      }

      const res = await addAdvisee({
        adviserId,
        studentId: selectedStudent[0],
        memberIds: selectedMembers,
      });

      if (res.success) {
        toast.success(res.message || "Advisee added successfully!");
        // reset
        setSelectedStudent([]);
        setSelectedMembers([]);
        setOpen(false);
        onAdded?.();
      } else {
        toast.error(res.message || "Failed to add advisee.");
      }
    } catch (err) {
      console.error("addAdvisee error:", err);
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // Convert to MultiSelect options
  const studentOptions = students.map((s) => ({ label: s.name, value: s.id }));
  const facultyOptions = faculty.map((f) => ({ label: f.name, value: f.id }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full lg:w-fit">
          <PlusCircle size={16} />
          Add Advisee
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Advisee</DialogTitle>
          <DialogDescription>
            Select a student and optionally assign members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student MultiSelect (single) */}
          <div className="grid gap-2">
            <Label>Student</Label>

            {/* Show loading placeholder if lists still loading */}
            {loadingLists ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            ) : (
              <MultiSelect
                singleSelect
                options={studentOptions}
                value={selectedStudent}
                onValueChange={setSelectedStudent}
                placeholder="Select student..."
                searchable
                maxCount={1}
              />
            )}
          </div>

          {/* Members MultiSelect */}
          <div className="grid gap-2">
            <Label>Members (Optional)</Label>
            <MultiSelect
              options={facultyOptions}
              value={selectedMembers}
              onValueChange={setSelectedMembers}
              placeholder="Select faculty/staff members"
              searchable
              maxCount={3}
            />
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Close
              </Button>
            </DialogClose>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Advisee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
