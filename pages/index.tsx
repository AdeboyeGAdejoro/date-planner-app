// pages/index.tsx
import Head from "next/head";
import Link from "next/link"; // make sure this is at the top if not already there
import { useMemo, useState } from "react";
import MultiSelect from "@/components/MultiSelect";
import Select, { Option } from "@/components/Select";
import dateTypes from "@/data/dateTypes.json";
import rawLocations from "@/data/locations.json";
import { useEffect } from "react";
import LocationCard, { type Location } from "@/components/LocationCard";
import BookingForm, { type Booking } from "@/components/BookingForm";
// import { loadBookings, saveBookings } from "@/utils/bookings";



// Optional country-name map (expand later as you add countries)
const COUNTRY_LABELS: Record<string, string> = {
  DE: "Germany",
};

export default function Home() {
  // --- State ---
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [bookingFor, setBookingFor] = useState<Location | null>(null);
  // const [bookings, setBookings] = useState<Booking[]>([]);


  // Parse locations as typed
  const locations: Location[] = rawLocations as Location[];

  // --- Build Country options from data (unique countries present) ---
  const countryOptions: Option[] = useMemo(() => {
    const codes = Array.from(new Set(locations.map((l) => l.country)));
    return codes.map((code) => ({
      value: code,
      label: COUNTRY_LABELS[code] ?? code,
    }));
  }, [locations]);

  // --- Build City options based on chosen country ---
  const cityOptions: Option[] = useMemo(() => {
    if (!selectedCountry) return [];
    const cities = Array.from(
      new Set(
        locations
          .filter((l) => l.country === selectedCountry)
          .map((l) => l.city)
      )
    );
    return cities.map((c) => ({ value: c, label: c }));
  }, [locations, selectedCountry]);

 // If country changes and the current city doesn't belong to it, clear city
 // const isCityValidForCountry: boolean =
//    !selectedCity ||
//    locations.some((l) => l.country === selectedCountry && l.city === selectedCity);
//  if (selectedCountry && !isCityValidForCountry) {
//    setSelectedCity("");
//  }

  useEffect(() => {
  if (
    selectedCity &&
    !locations.some((l) => l.country === selectedCountry && l.city === selectedCity)
  ) {
    setSelectedCity("");
  }
}, [selectedCountry, selectedCity, locations]);

  // --- Filter results (Country → City → Types) ---
  const filtered: Location[] = useMemo(() => {
    return locations
      .filter((l) => (selectedCountry ? l.country === selectedCountry : true))
      .filter((l) => (selectedCity ? l.city === selectedCity : true))
      .filter((l) =>
        selectedTypes.length > 0 ? selectedTypes.includes(l.type) : true
      );
  }, [locations, selectedCountry, selectedCity, selectedTypes]);

  // Nice little label for types chosen
  const selectedTypesLabel = useMemo(() => {
    if (selectedTypes.length === 0) return "All types";
    return selectedTypes.join(", ");
  }, [selectedTypes]);

//   useEffect(() => {
//   setBookings(loadBookings());
// }, []);

async function handleConfirmBooking(newBooking: Booking): Promise<void> {
  try {
    const resp = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    });

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      alert(`Error creating booking: ${data.error ?? resp.statusText}`);
      return;
    }

    // Simulated email (console log)
    console.log(
      `[Email] To: ${newBooking.email}\n` +
        `Subject: Booking confirmed — ${newBooking.locationName}\n` +
        `Hi ${newBooking.name}, your booking for ${newBooking.people} at ` +
        `${new Date(newBooking.datetimeISO).toLocaleString()} is confirmed.`
    );

    alert("Booking confirmed!");
    setBookingFor(null);
  } catch (e) {
    console.error(e);
    alert("Network error creating booking.");
  }
}



  return (
    <>
      <Head>
        <title>Date Planner</title>
        <meta name="description" content="Plan great dates, simply." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
          <header>
            <h1 className="text-3xl font-bold">Plan Your Perfect Date</h1>
            <p className="text-gray-600">
              Filter by country, city, and date type to see relevant spots.
            </p>
            <Link href="/bookings" className="text-blue-600 underline">
              My Bookings
            </Link>
          </header>

          {/* Filters */}
          <section className="bg-white p-6 rounded-xl border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                id="country"
                label="Country"
                value={selectedCountry}
                onChange={(v) => {
                  setSelectedCountry(v);
                  // clearing city if country changes (handled above defensively too)
                  setSelectedCity("");
                }}
                options={countryOptions}
                placeholder="Choose a country"
              />

              <Select
                id="city"
                label="City"
                value={selectedCity}
                onChange={setSelectedCity}
                options={cityOptions}
                placeholder={selectedCountry ? "Choose a city" : "Select country first"}
                disabled={!selectedCountry}
              />
            </div>

            <MultiSelect
              label="Select Date Type"
              options={dateTypes}
              value={selectedTypes}
              onChange={setSelectedTypes}
            />

            <p className="text-sm text-gray-600">
              <span className="font-medium">Filters:</span>{" "}
              {selectedCountry ? (COUNTRY_LABELS[selectedCountry] ?? selectedCountry) : "All countries"}{" "}
              {selectedCity ? `· ${selectedCity}` : ""} · {selectedTypesLabel}
            </p>
          </section>

          {/* Results */}
          <section className="bg-white p-6 rounded-xl border">
            <h2 className="text-xl font-semibold mb-4">
              Results ({filtered.length})
            </h2>
            {filtered.length === 0 ? (
              <p className="text-gray-600">No locations match your filters yet.</p>
            ) : (
              <div className="space-y-4">
                {filtered.map((loc) => (
                  <LocationCard
                    key={loc.id}
                    location={loc}
                    countryLabels={COUNTRY_LABELS}
                    onBook={(id) => {
                      const match = filtered.find((x) => x.id === id);
                      if (match) setBookingFor(match);
                    }}
                  />
                ))}
              </div>              
            )}
          </section>
        </div>
      </main>
      {bookingFor && (
        <BookingForm
          location={bookingFor}
          onConfirm={handleConfirmBooking}
          onClose={() => setBookingFor(null)}
        />
      )}
    </>
  );
}
