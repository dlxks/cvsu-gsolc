"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export type MultiSelectOption = {
  value: string;
  label: string;
};

export type MultiSelectGroup = {
  heading: string;
  options: MultiSelectOption[];
};

type MultiSelectProps = {
  options: MultiSelectOption[] | MultiSelectGroup[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyIndicator?: string;
  className?: string;
  disabled?: boolean;
  singleSelect?: boolean;
  maxCount?: number;
  searchable?: boolean;
};

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyIndicator = "No results found.",
  className,
  disabled = false,
  singleSelect = false,
  maxCount,
  searchable = true,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (val: string) => {
    if (singleSelect) {
      onValueChange([val]);
      setOpen(false);
      return;
    }

    if (value.includes(val)) {
      onValueChange(value.filter((v) => v !== val));
    } else {
      if (maxCount && value.length >= maxCount) return;
      onValueChange([...value, val]);
    }
  };

  const displayValue = React.useMemo(() => {
    const flatOptions: MultiSelectOption[] =
      Array.isArray(options) &&
      options.length > 0 &&
      "heading" in (options[0] || {})
        ? (options as MultiSelectGroup[]).flatMap((g) => g.options)
        : (options as MultiSelectOption[]);

    return value
      .map((val) => flatOptions.find((opt) => opt.value === val)?.label)
      .filter(Boolean)
      .join(", ");
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !displayValue && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="z-9999 w-(--radix-popover-trigger-width) p-0"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={searchable}>
          {searchable && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{emptyIndicator}</CommandEmpty>

            {Array.isArray(options) &&
            options.length > 0 &&
            "heading" in (options[0] || {})
              ? (options as MultiSelectGroup[]).map((group) => (
                  <CommandGroup key={group.heading} heading={group.heading}>
                    {group.options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleSelect(option.value)}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            value.includes(option.value)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50"
                          )}
                        >
                          {value.includes(option.value) && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))
              : (options as MultiSelectOption[]).map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        value.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {value.includes(option.value) && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
