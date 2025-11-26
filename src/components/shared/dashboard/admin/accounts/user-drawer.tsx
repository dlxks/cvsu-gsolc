"use client";

import { useIsMobile } from "@/src/hooks/use-mobile";
import { UserItem } from "./users-table";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Button } from "@/src/components/ui/button";
import { updateUserAction } from "@/src/app/dashboard/(admin)/students/actions";
import EditForm from "./edit-form";
import { UserPen } from "lucide-react";

export interface UserDrawerProps {
  item: UserItem;
  role?: "STUDENT" | "STAFF" | "FACULTY";
  fetchData?: () => Promise<void>;
}

const UserDrawer = ({ item, role = "STUDENT", fetchData }: UserDrawerProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const capitalizedRole =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center w-full justify-start pl-2"
        >
          <UserPen size={16} />
          Edit
        </Button>
      </DrawerTrigger>

      <DrawerContent className="w-full mx-auto py-8 sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Edit {capitalizedRole} Information</DrawerTitle>
          <DrawerDescription>
            Update {item.firstName} {item.lastName}’s details below.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2">
          <EditForm
            user={item}
            id={item.id}
            updateUserAction={updateUserAction}
            onUpdated={() => {
              setOpen(false);
              fetchData?.();
            }}
          />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
