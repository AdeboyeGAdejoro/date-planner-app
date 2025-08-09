import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);
      const userId = session?.userId;
      if (!userId) return res.status(200).json([]); // not signed in: return empty

      const bookings = await prisma.booking.findMany({
        where: { userId },
        orderBy: { submittedAt: "desc" },
      });
      return res.status(200).json(bookings);
    }

    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);
      const userId = session?.userId ?? null;

      const {
        id,
        locationId,
        locationName,
        dateType,
        name,
        email,
        people,
        datetimeISO,
        notes,
      } = req.body as {
        id: string;
        locationId: string;
        locationName: string;
        dateType: string;
        name: string;
        email: string;
        people: number;
        datetimeISO: string;
        notes?: string;
      };

      if (
        !id ||
        !locationId ||
        !locationName ||
        !dateType ||
        !name ||
        !email ||
        !people ||
        !datetimeISO
      ) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const created = await prisma.booking.create({
        data: {
          id,
          locationId,
          locationName,
          dateType,
          name,
          email,
          people,
          datetime: new Date(datetimeISO),
          notes,
          userId, // ← link to user if signed in
        },
      });

      return res.status(201).json(created);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    const msg = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ error: msg });
  }
}
