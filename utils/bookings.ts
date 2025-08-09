// utils/bookings.ts
import type { Booking } from "@/components/BookingForm";

const STORAGE_KEY = "date-planner-bookings";

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(b: Booking): Booking[] {
  const next = [b, ...loadBookings()];
  saveBookings(next);
  return next;
}

export function clearBookings(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function deleteBooking(id: string): Booking[] {
  const next = loadBookings().filter((b) => b.id !== id);
  saveBookings(next);
  return next;
}
