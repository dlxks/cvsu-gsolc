"use client";

import { cn } from "@/src/lib/utils";
import React, { HTMLProps, forwardRef, createContext, useContext } from "react";

const ToolbarContext = createContext<{ dense?: boolean }>({ dense: false });

export const useToolbarCtx = () => useContext(ToolbarContext);

export type ToolbarProps = {
  dense?: boolean;
  vertical?: boolean;
} & HTMLProps<HTMLDivElement>;

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ children, dense, vertical = false, className, ...rest }, ref) => {
    return (
      <ToolbarContext.Provider value={{ dense }}>
        <div
          ref={ref}
          className={cn(
            "flex flex-wrap items-center gap-2 p-2 bg-white rounded border shadow-sm",
            vertical && "flex-col items-stretch",
            dense && "p-1 gap-1",
            className
          )}
          {...rest}
        >
          {children}
        </div>
      </ToolbarContext.Provider>
    );
  }
);

Toolbar.displayName = "Toolbar";

/* ---------------------------- ToolbarGroup ---------------------------- */

export type ToolbarGroupProps = {
  className?: string;
  children: React.ReactNode;
} & HTMLProps<HTMLDivElement>;

const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, children, ...rest }, ref) => {
    const { dense } = useToolbarCtx();

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "flex items-center gap-1",
          dense && "gap-0 p-0", // APPLY DENSE HERE
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

ToolbarGroup.displayName = "ToolbarGroup";

/* ---------------------------- Toolbar Divider ---------------------------- */

export type ToolbarDividerProps = {
  horizontal?: boolean;
} & HTMLProps<HTMLDivElement>;

const ToolbarDivider = forwardRef<HTMLDivElement, ToolbarDividerProps>(
  ({ horizontal, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-neutral-200 dark:bg-neutral-300",
          horizontal ? "h-px w-full my-1" : "w-px self-stretch mx-1",
          className
        )}
        {...rest}
      />
    );
  }
);

ToolbarDivider.displayName = "Toolbar.Divider";

export { Toolbar, ToolbarGroup, ToolbarDivider };
