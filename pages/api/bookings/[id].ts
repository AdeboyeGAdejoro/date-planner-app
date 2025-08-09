// pages/api/bookings/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query as { id: string };

  try {
    if (req.method === "DELETE") {
      await prisma.booking.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
