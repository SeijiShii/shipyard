import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind クラス結合ユーティリティ（条件付き + 競合解決）。
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
