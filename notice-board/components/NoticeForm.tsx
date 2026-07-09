import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { createNotice, updateNotice } from "@/lib/services/noticeService";
import { CATEGORIES, PRIORITIES } from "@/lib/validation";
import type { ApiError } from "@/lib/types";

export type NoticeFormValues = {
  title: string;
  body: string;
  category: (typeof CATEGORIES)[number];
  priority: (typeof PRIORITIES)[number];
  publishDate: string;
  image: string;
};

type NoticeFormProps = {
  initialValues?: NoticeFormValues;
  noticeId?: number;
  submitLabel: string;
};

const emptyValues: NoticeFormValues = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: "",
  image: "",
};

export default function NoticeForm({
  initialValues,
  noticeId,
  submitLabel,
}: NoticeFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<NoticeFormValues>(
    initialValues ?? emptyValues,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof NoticeFormValues>(
    key: K,
    value: NoticeFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFieldErrors({});

    const payload = {
      ...values,
      image: values.image.trim() === "" ? undefined : values.image.trim(),
    };

    try {
      if (noticeId) {
        await updateNotice(noticeId, payload);
      } else {
        await createNotice(payload);
      }

      await router.push("/");
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.errors?.length) {
        const nextErrors: Record<string, string> = {};
        for (const issue of apiError.errors) {
          nextErrors[issue.field] = issue.message;
        }
        setFieldErrors(nextErrors);
      }

      setFormError(apiError.message || "Failed to save notice");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-5">
        <Field label="Title" error={fieldErrors.title}>
          <input
            type="text"
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            className={inputClass(fieldErrors.title)}
            placeholder="Enter notice title"
          />
        </Field>

        <Field label="Body" error={fieldErrors.body}>
          <textarea
            value={values.body}
            onChange={(event) => updateField("body", event.target.value)}
            rows={6}
            className={inputClass(fieldErrors.body)}
            placeholder="Write the notice details"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" error={fieldErrors.category}>
            <select
              value={values.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value as NoticeFormValues["category"],
                )
              }
              className={inputClass(fieldErrors.category)}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Priority" error={fieldErrors.priority}>
            <select
              value={values.priority}
              onChange={(event) =>
                updateField(
                  "priority",
                  event.target.value as NoticeFormValues["priority"],
                )
              }
              className={inputClass(fieldErrors.priority)}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Publish Date" error={fieldErrors.publishDate}>
          <input
            type="date"
            value={values.publishDate}
            onChange={(event) =>
              updateField("publishDate", event.target.value)
            }
            className={inputClass(fieldErrors.publishDate)}
          />
        </Field>

        <Field
          label="Image URL (optional)"
          error={fieldErrors.image}
          hint="Bonus: paste a public image URL"
        >
          <input
            type="url"
            value={values.image}
            onChange={(event) => updateField("image", event.target.value)}
            className={inputClass(fieldErrors.image)}
            placeholder="https://example.com/image.jpg"
          />
        </Field>
      </div>

      {formError ? (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

function Field({ label, error, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-300 focus:border-slate-400 focus:ring-slate-100"
  }`;
}
