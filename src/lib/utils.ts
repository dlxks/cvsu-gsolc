import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nullToUndefined<T extends Record<string, any>>(obj: T): {
  [K in keyof T]: Exclude<T[K], null> | undefined
} {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value ?? undefined])
  ) as any;
}
