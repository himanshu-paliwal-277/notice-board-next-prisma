import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeNotice } from "@/lib/notices";
import { formatZodErrors, noticeSchema } from "@/lib/validation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
      });

      return res.status(200).json(notices.map(serializeNotice));
    } catch {
      return res.status(500).json({ message: "Failed to fetch notices" });
    }
  }

  if (req.method === "POST") {
    const parsed = noticeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    const { title, body, category, priority, publishDate, image } =
      parsed.data;

    try {
      const notice = await prisma.notice.create({
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image ?? null,
        },
      });

      return res.status(201).json(serializeNotice(notice));
    } catch {
      return res.status(500).json({ message: "Failed to create notice" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
