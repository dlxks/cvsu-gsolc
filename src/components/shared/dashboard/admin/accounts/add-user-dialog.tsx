"use client";

import React, { useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUserAction } from "@/src/app/dashboard/(admin)/students/actions";
import { CirclePlus } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  role: "STUDENT" | "STAFF" | "FACULTY";
};
export function AddUserDialog({
  role,
  onAdd,
}: {
  role: "STUDENT" | "STAFF" | "FACULTY";
  onAdd?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { role },
  });

  const onSubmit = (data: FormData) =>
    startTransition(async () => {
      try {
        const res = await createUserAction(data);
        if (res.success) {
          toast.success(`${role} added successfully!`);
          reset();
          onAdd?.();
        } else toast.error(`${role} already exists!`);
      } catch {
        toast.error(`Failed to add ${role.toLowerCase()}.`);
      }
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="capitalize w-full lg:w-fit flex">
          <CirclePlus size={16} />
          Add {role.toLowerCase()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add {role.toLowerCase()}</DialogTitle>
          <DialogDescription>
            Create a new {role.toLowerCase()} account. When this Gmail logs in
            via Google, it will automatically link to the same account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                {...register("firstName", { required: true })}
                placeholder="John"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                {...register("lastName", { required: true })}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <Label>Email (Gmail)</Label>
            <Input
              type="email"
              {...register("email", { required: true })}
              placeholder={`${role.toLowerCase()}@cvsu.edu.ph`}
            />
          </div>

          <div>
            <Label>Profile Image URL (optional)</Label>
            <Input {...register("image")} placeholder="https://..." />
          </div>

          <input type="hidden" {...register("role")} value={role} />

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : `Add ${role.toLowerCase()}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
