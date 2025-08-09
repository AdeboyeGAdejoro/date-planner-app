// components/BookingForm.tsx
import React, { useMemo, useState } from "react";
import type { Location } from "./LocationCard";

export type Booking = {
  id: string;                // unique booking id
  locationId: string;        // which location was booked
  locationName: string;      // denormalized for display/email
  dateType: string;          // Dining/Movies/Museums
  name: string;              // user name
  email: string;             // user email
  people: number;            // party size
  datetimeISO: string;       // combined ISO string from date + time
  submittedAtISO: string;    // when the booking was made
  notes?: string;            // optional free text
};

export type BookingFormProps = {
  /** The location being booked (to show context + fill denormalized fields) */
  location: Location;
  /** Called when the user successfully submits a booking */
  onConfirm: (booking: Booking) => void;
  /** Called when the user cancels/closes the form */
  onClose: () => void;
};

function isValidEmail(email: string): boolean {
  // Basic email pattern; good enough for MVP
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function combineDateTime(dateStr: string, timeStr: string): string | null {
  if (!dateStr || !timeStr) return null;
  // Build ISO string in local time (MVP-level)
  const iso = new Date(`${dateStr}T${timeStr}`).toISOString();
  return iso;
}

export default function BookingForm({
  location,
  onConfirm,
  onClose,
}: BookingFormProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [people, setPeople] = useState<number>(2);
  const [date, setDate] = useState<string>(""); // YYYY-MM-DD
  const [time, setTime] = useState<string>(""); // HH:MM (24h)
  const [notes, setNotes] = useState<string>("");

  // Derived datetime + basic validation
  const datetimeISO = useMemo(() => combineDateTime(date, time), [date, time]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!isValidEmail(email)) e.email = "Enter a valid email.";
    if (!people || people < 1) e.people = "Party size must be at least 1.";
    if (!date) e.date = "Date is required.";
    if (!time) e.time = "Time is required.";
    if (datetimeISO) {
      const dt = new Date(datetimeISO);
      if (isNaN(dt.getTime())) e.datetime = "Invalid date/time.";
      else if (dt.getTime() < Date.now()) e.datetime = "Booking must be in the future.";
    }
    return e;
  }, [name, email, people, date, time, datetimeISO]);

  const isValid = Object.keys(errors).length === 0;

  const submit = (): void => {
    if (!isValid || !datetimeISO) return;
    const booking: Booking = {
      id: crypto.randomUUID(),
      locationId: location.id,
      locationName: location.name,
      dateType: location.type,
      name: name.trim(),
      email: email.trim(),
      people,
      datetimeISO,
      submittedAtISO: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };
    onConfirm(booking);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${location.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal body */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Book: {location.name}</h3>
          <p className="text-sm text-gray-600">
            {location.type} · {location.city}, {location.country}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">People</label>
            <input
              type="number"
              min={1}
              max={20}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-invalid={!!errors.people}
            />
            {errors.people && <p className="mt-1 text-xs text-red-600">{errors.people}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-invalid={!!errors.time}
              />
              {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Any special requests?"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!isValid}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Confirm booking
          </button>
        </div>

        {/* Form-wide error (datetime) */}
        {"datetime" in errors && (
          <p className="mt-3 text-sm text-red-600">{errors.datetime}</p>
        )}
      </div>
    </div>
  );
}
