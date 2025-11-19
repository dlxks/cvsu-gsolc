"use client";

import {
  createAnnouncementAction,
  updateAnnouncementAction,
} from "@/src/app/dashboard/(staff)/announcements/actions";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { AnnouncementStatus } from "@/src/constants/enums";
import { cn } from "@/src/lib/utils";
import { AnnouncementTypes } from "@/src/types/announcement";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";

// -----------------------------
// Zod schema
// -----------------------------
export const announcementFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  status: z.nativeEnum(AnnouncementStatus),
  expiry: z.string().optional(),
  content: z.string().optional(), // now just plain string instead of editor state
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export interface AnnouncementFormProps {
  initialData?: AnnouncementTypes | null;
  createdBy: string | undefined;
  onSuccess?: (announcement: AnnouncementTypes) => void;
}

const AnnouncementForm = ({
  initialData,
  createdBy,
  onSuccess,
}: AnnouncementFormProps) => {
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      status: initialData?.status ?? AnnouncementStatus.VISIBLE,
      expiry: initialData?.expiry
        ? new Date(initialData.expiry).toISOString().slice(0, 16)
        : "",
      content: initialData?.content ?? "",
    },
  });

  const handleSubmit = async (values: AnnouncementFormValues) => {
    if (!createdBy) return;

    setLoading(true);
    try {
      const dataToSubmit = { ...values };

      const response = isEditing
        ? await updateAnnouncementAction(
            initialData!.id,
            dataToSubmit,
            createdBy
          )
        : await createAnnouncementAction(dataToSubmit, createdBy);

      if (response.success && response.announcement) {
        toast.success(
          isEditing
            ? "Announcement updated successfully!"
            : "Announcement created successfully!"
        );

        onSuccess?.(response.announcement);

        if (!isEditing) form.reset();
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting announcement:", error);
      toast.error("Failed to save announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={loading}
                  placeholder="Enter announcement title..."
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AnnouncementStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Expiry */}
        <FormField
          control={form.control}
          name="expiry"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date (optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                      <CalendarIcon className="ml-auto opacity-50" size={16} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                  {field.value && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => field.onChange("")}
                    >
                      Clear
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        {/* Content (plain text field now) */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contents</FormLabel>
              <FormControl>
                {/* <Input
                  {...field}
                  disabled={loading}
                  placeholder="Enter announcement content..."
                /> */}
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Announcement"
            : "Create Announcement"}
        </Button>
      </form>
    </Form>
  );
};

export default AnnouncementForm;
