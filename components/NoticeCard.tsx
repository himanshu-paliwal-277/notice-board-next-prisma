import { useRouter } from "next/router";
import { useState } from "react";
import { formatDisplayDate } from "@/lib/notices";
import { deleteNotice } from "@/lib/services/noticeService";
import type { Notice } from "@/lib/types";

type NoticeCardProps = {
  notice: Notice;
  onDeleted: (id: number) => void;
};

export default function NoticeCard({ notice, onDeleted }: NoticeCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${notice.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteNotice(notice.id);
      onDeleted(notice.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete notice");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {notice.category}
          </span>
          {notice.priority === "Urgent" ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              Urgent
            </span>
          ) : null}
        </div>
        <time className="text-xs text-slate-500">
          {formatDisplayDate(notice.publishDate)}
        </time>
      </div>

      {notice.image ? (
        <img
          src={notice.image}
          alt={notice.title}
          className="mb-4 h-40 w-full rounded-xl object-cover"
        />
      ) : null}

      <h2 className="text-lg font-semibold text-slate-900">{notice.title}</h2>
      <p className="mt-2 flex-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {notice.body}
      </p>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => router.push(`/notice/${notice.id}`)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
