import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import NoticeCard from "@/components/NoticeCard";
import { getNotices } from "@/lib/services/noticeService";
import type { Notice } from "@/lib/types";

export default function HomePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await getNotices();
        setNotices(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load notices",
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, []);

  function handleDeleted(id: number) {
    setNotices((current) => current.filter((notice) => notice.id !== id));
  }

  return (
    <Layout
      title="All campus notices in one place"
      action={
        <Link
          href="/notice/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add Notice
        </Link>
      }
    >
      {loading ? (
        <p className="text-sm text-slate-500">Loading notices...</p>
      ) : null}

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!loading && !error && notices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No notices yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Create your first notice to get started.
          </p>
          <Link
            href="/notice/new"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add Notice
          </Link>
        </div>
      ) : null}

      {!loading && notices.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      ) : null}
    </Layout>
  );
}
