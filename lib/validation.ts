import { z } from "zod";

export const CATEGORIES = ["Exam", "Event", "General"] as const;
export const PRIORITIES = ["Normal", "Urgent"] as const;

export const noticeSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  body: z.string().trim().min(1, "Body is required"),
  category: z.enum(CATEGORIES, {
    message: "Category must be Exam, Event, or General",
  }),
  priority: z.enum(PRIORITIES, {
    message: "Priority must be Normal or Urgent",
  }),
  publishDate: z
    .string()
    .trim()
    .min(1, "Publish date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Publish date must be valid",
    }),
  image: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    },
    z.string().url("Image must be a valid URL").optional(),
  ),
});

export type NoticeInput = z.infer<typeof noticeSchema>;

export function formatZodErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "form",
    message: issue.message,
  }));
}
