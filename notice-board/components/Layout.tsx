import Link from "next/link";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
};

export default function Layout({ children, title, action }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Notice Board
            </Link>
            {title ? (
              <p className="mt-1 text-sm text-slate-500">{title}</p>
            ) : null}
          </div>
          {action}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
