// pages/bookings.tsx
import React, { JSX } from "react";
import Head from "next/head";
import Link from "next/link"; // add at the top
import { useEffect, useState } from "react";
import type { Booking } from "@/components/BookingForm";
// import { loadBookings, clearBookings, deleteBooking } from "@/utils/bookings";
// import { clearBookings } from "@/utils/bookings";
// import type { Booking as PrismaBooking } from "@prisma/client"; // Prisma DB type

type ApiBooking = {
  id: string;
  locationId: string;
  locationName: string;
  dateType: string;
  name: string;
  email: string;
  people: number;
  datetime: string;     // <-- ISO string in JSON
  submittedAt: string;  // <-- ISO string in JSON
  notes: string | null;
};

export default function MyBookings(): JSX.Element {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/api/bookings");
        const data: ApiBooking[] = await resp.json();

        const normalized: Booking[] = data.map((b) => ({
          id: b.id,
          locationId: b.locationId,
          locationName: b.locationName,
          dateType: b.dateType,
          name: b.name,
          email: b.email,
          people: b.people,
          datetimeISO: b.datetime,        // already an ISO string from API
          submittedAtISO: b.submittedAt,  // already an ISO string
          notes: b.notes ?? undefined,
        }));

        setBookings(normalized);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Delete this booking?")) return;
    const resp = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (resp.ok) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert("Failed to delete booking.");
    }
  };

  // Optional: “Clear all” using the API (delete each one)
  const handleClear = async (): Promise<void> => {
    if (!confirm("Clear all bookings?")) return;
    await Promise.all(
      bookings.map((b) => fetch(`/api/bookings/${b.id}`, { method: "DELETE" }))
    );
    setBookings([]);
  };

  return (
    <>
      <Head>
        <title>My Bookings</title>
        <meta name="description" content="View your date bookings." />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <Link href="/" className="text-sm text-blue-600 underline">
              ← Back home
            </Link>
          </header>

          <div className="bg-white p-6 rounded-xl border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Saved ({bookings.length})</h2>
              {bookings.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Clear all
                </button>
              )}
            </div>

            {bookings.length === 0 ? (
              <p className="text-gray-600">No bookings yet.</p>
            ) : (
              <ul className="space-y-4">
                {bookings.map((b) => (
                  <li key={b.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold truncate">
                          {b.locationName}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {b.dateType} · {new Date(b.datetimeISO).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          For {b.people} · {b.name} ({b.email})
                        </p>
                        {b.notes && (
                          <p className="text-sm text-gray-600 mt-1">Notes: {b.notes}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Booked at {new Date(b.submittedAtISO).toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id)}
                        className="shrink-0 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                        aria-label={`Delete booking for ${b.locationName}`}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

