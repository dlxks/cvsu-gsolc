import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Custom classname
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Object mapping
export function nullToUndefined<T extends Record<string, any>>(obj: T): {
  [K in keyof T]: Exclude<T[K], null> | undefined
} {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value ?? undefined])
  ) as any;
}

// Format Date
export function formatDate(dateString: Date | string) {
  const date = new Date(dateString)

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}

// Truncate text for card list
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + " . . .";
}
