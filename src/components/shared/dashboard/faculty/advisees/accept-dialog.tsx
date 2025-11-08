"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { ReactNode, useTransition } from "react";
import { toast } from "sonner";
import { updateAdviseeStatusAction } from "@/src/app/dashboard/(faculty)/advisees/actions";

interface AcceptAdviseeDialogProps {
  itemName: string;
  adviseeId: string;
  onConfirm?: () => Promise<void> | void;
  children: ReactNode;
}

export default function AcceptAdviseeDialog({
  itemName,
  adviseeId,
  onConfirm,
  children,
}: AcceptAdviseeDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(async () => {
      const res = await updateAdviseeStatusAction(adviseeId, "ACTIVE");
      if (res.success) {
        toast.success(`${itemName} has been accepted successfully.`);
        if (onConfirm) await onConfirm();
      } else {
        toast.error(res.message || "Failed to accept advisee.");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Accept Advisee</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to accept{" "}
            <span className="font-semibold">{itemName}</span> as your advisee?
            This will update their status to <b>ACTIVE</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAccept}
            disabled={isPending}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isPending ? "Accepting..." : "Accept"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
