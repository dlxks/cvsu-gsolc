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
import Tiptap from "@/src/components/tiptap-editor/tiptap-editor";

// Schema
export const announcementFormSchema = z.object({
  title: z.string().min(3),
  status: z.nativeEnum(AnnouncementStatus),
  expiry: z.string().optional(),
  content: z.string().optional(),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export interface AnnouncementFormProps {
  initialData?: AnnouncementTypes | null;
  createdBy?: string;
}

const AnnouncementForm = ({
  initialData,
  createdBy,
}: AnnouncementFormProps) => {
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      status: initialData?.status ?? AnnouncementStatus.VISIBLE,
      expiry: initialData?.expiry
        ? new Date(initialData.expiry).toISOString()
        : "",
      content: initialData?.content ?? "<p>Enter your announcement...</p>",
    },
  });

  const handleSubmit = async (values: AnnouncementFormValues) => {
    if (!createdBy) return;

    setLoading(true);
    try {
      const response = isEditing
        ? await updateAnnouncementAction(initialData!.id, values, createdBy)
        : await createAnnouncementAction(values, createdBy);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(
        isEditing
          ? "Announcement updated successfully."
          : "Announcement created successfully."
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
            </FormItem>
          )}
        />

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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AnnouncementStatus).map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

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
                        "w-full justify-start text-left",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? format(new Date(field.value), "PPP")
                        : "Select a date"}
                      <CalendarIcon className="ml-auto opacity-50" size={16} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Tiptap value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button disabled={loading} type="submit">
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
