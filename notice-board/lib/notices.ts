import type { Notice } from "@/lib/types";

export function serializeNotice(notice: {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: Date;
  image: string | null;
  createdAt: Date;
}): Notice {
  return {
    id: notice.id,
    title: notice.title,
    body: notice.body,
    category: notice.category,
    priority: notice.priority,
    publishDate: notice.publishDate.toISOString(),
    image: notice.image,
    createdAt: notice.createdAt.toISOString(),
  };
}

export function formatDisplayDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toDateInputValue(isoDate: string) {
  return isoDate.slice(0, 10);
}
