import type { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import NoticeForm, { type NoticeFormValues } from "@/components/NoticeForm";
import { toDateInputValue } from "@/lib/notices";
import { getNoticeById } from "@/lib/services/noticeService";

type EditNoticePageProps = {
  notice: NoticeFormValues;
  noticeId: number;
};

export default function EditNoticePage({
  notice,
  noticeId,
}: EditNoticePageProps) {
  return (
    <Layout title="Edit notice">
      <NoticeForm
        initialValues={notice}
        noticeId={noticeId}
        submitLabel="Update Notice"
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<
  EditNoticePageProps | { notFound: true }
> = async (context) => {
  const rawId = context.params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id || Number.isNaN(Number(id))) {
    return { notFound: true };
  }

  const protocol = context.req.headers["x-forwarded-proto"] ?? "http";
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    const data = await getNoticeById(id, baseUrl);

    return {
      props: {
        noticeId: data.id,
        notice: {
          title: data.title,
          body: data.body,
          category: data.category as NoticeFormValues["category"],
          priority: data.priority as NoticeFormValues["priority"],
          publishDate: toDateInputValue(data.publishDate),
          image: data.image ?? "",
        },
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { notFound: true };
    }

    throw error;
  }
};
