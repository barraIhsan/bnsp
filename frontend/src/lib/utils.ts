import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmtTotalMin = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
export const fmtTimestamp = (t: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    hour12: true,
  }).format(new Date(t));
};
