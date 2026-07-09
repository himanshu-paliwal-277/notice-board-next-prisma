import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeNotice } from "@/lib/notices";
import { formatZodErrors, noticeSchema } from "@/lib/validation";

function parseId(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);

  if (!raw || Number.isNaN(id) || id <= 0) {
    return null;
  }

  return id;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = parseId(req.query.id);

  if (id === null) {
    return res.status(400).json({ message: "Invalid notice id" });
  }

  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({ where: { id } });

      if (!notice) {
        return res.status(404).json({ message: "Notice not found" });
      }

      return res.status(200).json(serializeNotice(notice));
    } catch {
      return res.status(500).json({ message: "Failed to fetch notice" });
    }
  }

  if (req.method === "PUT") {
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
      const existing = await prisma.notice.findUnique({ where: { id } });

      if (!existing) {
        return res.status(404).json({ message: "Notice not found" });
      }

      const notice = await prisma.notice.update({
        where: { id },
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image ?? null,
        },
      });

      return res.status(200).json(serializeNotice(notice));
    } catch {
      return res.status(500).json({ message: "Failed to update notice" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existing = await prisma.notice.findUnique({ where: { id } });

      if (!existing) {
        return res.status(404).json({ message: "Notice not found" });
      }

      await prisma.notice.delete({ where: { id } });

      return res.status(200).json({ message: "Notice deleted successfully" });
    } catch {
      return res.status(500).json({ message: "Failed to delete notice" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
