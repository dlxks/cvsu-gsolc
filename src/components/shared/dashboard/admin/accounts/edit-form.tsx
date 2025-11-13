"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { FieldGroup } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { PhoneInput } from "@/src/components/ui/phone-input";
import { Button } from "@/src/components/ui/button";
import { UserItem } from "./users-table";
import { UserRole } from "@/src/app/dashboard/(admin)/students/actions";

// ✅ Zod validation schema
const editUserSchema = z.object({
  studentId: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditFormProps {
  user: UserItem;
  id: string;
  updateUserAction: (
    id: string,
    formData: FormData,
    role: UserRole
  ) => Promise<{ success?: boolean; error?: string }>;
  onUpdated?: () => void;
}

export default function EditForm({
  user,
  id,
  updateUserAction,
  onUpdated,
}: EditFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      studentId: user.studentId ?? "",
      firstName: user.firstName ?? "",
      middleName: user.middleName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
    },
  });

  const onSubmit = (data: EditUserFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    startTransition(async () => {
      try {
        const result = await updateUserAction(
          id,
          formData,
          user.role as UserRole
        );

        if (result?.success) {
          toast.success(
            `${user.role ?? "User"} information updated successfully!`
          );
          onUpdated?.();
        } else {
          toast.error(
            result?.error || `Failed to update ${user.role ?? "user"} info.`
          );
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("An unexpected error occurred while updating.");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-1 overflow-y-auto max-h-[70vh]"
      >
        <FieldGroup>
          {/* Student ID */}
          {(user.role === "STUDENT" || user.studentId) && (
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 2020-XXXXX"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Name Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Middle Name{" "}
                    <span className="text-gray-500 text-xs">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Van"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Doe"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. example@school.edu"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number{" "}
                    <span className="text-gray-500 text-xs">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      defaultCountry="PH"
                      placeholder="e.g. 0917 123 4567"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FieldGroup>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
