import React from "react";
import Image from "next/image";

export type Location = {
  id: string;
  type: string;       // e.g., "Dining"
  name: string;
  address: string;
  country: string;    // ISO code, e.g., "DE"
  city: string;
  rating: number;
  link: string;
  images: string[];
};

export type LocationCardProps = {
  /** Full location object to display */
  location: Location;
  /** Friendly country name mapping (e.g., { DE: "Germany" }) */
  countryLabels?: Record<string, string>;
  /** Called when user clicks Book (we’ll handle form in the parent next) */
  onBook?: (locationId: string) => void;
};

export default function LocationCard({
  location,
  countryLabels = {},
  onBook,
}: LocationCardProps) {
  const {
    id,
    name,
    type,
    address,
    city,
    country,
    rating,
    link,
    images,
  } = location;

  const countryLabel: string = countryLabels[country] ?? country;
  const src0 = images?.[0];
  const hasImage = typeof src0 === "string" && src0.startsWith("http");
  const imgSrc = hasImage ? src0 : "";
  const displayRating = rating > 0 ? `⭐ ${rating.toFixed(1)}` : "No rating yet";

  return (
    <article className="rounded-xl border p-4 sm:p-5 flex items-start justify-between gap-4">
      {/* Left block: text info */}
      <div className="min-w-0">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <p className="text-sm text-gray-600">
          {type} · {city || "—"}, {countryLabel}
        </p>
        {address && <p className="text-sm text-gray-600">{address}</p>}

        <p className="text-sm text-gray-700 mt-1">{displayRating}</p>

        <div className="mt-2 flex items-center gap-3">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 underline"
          >
            Website
          </a>

          {onBook && (
            <button
              type="button"
              onClick={() => onBook(id)}
              className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50"
              aria-label={`Book a date at ${name}`}
            >
              Book
            </button>
          )}
        </div>
      </div>

      {/* Right block: image or placeholder */}
      <div className="shrink-0">
        {hasImage ? (
          <Image
            src={imgSrc}
            alt={name}
            width={144}
            height={96}
            className="h-24 w-36 object-cover rounded-md border"
          />
        ) : (
          <div className="h-24 w-36 rounded-md border grid place-items-center text-xs text-gray-500">
            No image
          </div>
        )}
      </div>
    </article>
  );
}
