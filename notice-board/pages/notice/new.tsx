import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";

export default function NewNoticePage() {
  return (
    <Layout title="Create a new notice">
      <NoticeForm submitLabel="Create Notice" />
    </Layout>
  );
}
