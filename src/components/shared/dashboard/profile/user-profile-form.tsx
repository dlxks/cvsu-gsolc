"use client";

import { Card, CardContent } from "@/src/components/ui/card";
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  profileFormSchema,
  ProfileFormSchema,
} from "@/src/schemas/userProfileFormSchema";
import React from "react";
import { updateInformation } from "@/src/app/dashboard/profile/actions";
import { toast } from "sonner";

export type ProfileProps = {
  id: string;
  studentId?: string;
  staffId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};

interface ProfileFormProps {
  item: ProfileProps | null;
}

const UserProfileForm = ({ item }: ProfileFormProps) => {
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      idNumber: item?.studentId || item?.staffId || "",
      firstName: item?.firstName || "",
      middleName: item?.middleName || "",
      lastName: item?.lastName || "",
      email: item?.email || "",
      phoneNumber: item?.phoneNumber || "",
    },
  });

  const onSubmit = (data: ProfileFormSchema) => {
    React.startTransition(async () => {
      const result = await updateInformation(data);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div>
      <section className="grid grid-cols-1 lg:grid-cols-3 space-y-6">
        {/* Left Side */}
        <div className="space-y2 col-span-1">
          <h3 className="font-medium text-lg">Personal Information</h3>
          <p className="text-gray-500">Update your personal information</p>
        </div>

        {/* Right Side */}
        <Card className="w-full col-span-2">
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FieldGroup className="">
                  {/* ID Number */}
                  <FormField
                    control={form.control}
                    name="idNumber"
                    render={({ field }) => (
                      <FormItem className="max-w-xs">
                        <FormLabel>ID Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Student or Faculty ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Name Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 space-y-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John" {...field} />
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
                            <span className="text-gray-500">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Van" {...field} />
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
                            <Input placeholder="e.g. Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@domain.com"
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
                          <FormLabel>Phone Number (optional)</FormLabel>
                          <FormControl>
                            <PhoneInput
                              {...field}
                              defaultCountry="PH"
                              placeholder="e.g. 0917 123 4567"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FieldGroup>

                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default UserProfileForm;
