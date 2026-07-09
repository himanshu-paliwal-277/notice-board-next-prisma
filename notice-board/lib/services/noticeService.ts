import axios, { isAxiosError } from "axios";
import type { Notice, ApiError } from "@/lib/types";
import type { NoticeInput } from "@/lib/validation";

const api = axios.create({
  baseURL: "/api",
});

function getApiError(error: unknown, fallback: string): ApiError {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    return {
      message: data?.message ?? fallback,
      errors: data?.errors,
    };
  }

  return {
    message: error instanceof Error ? error.message : fallback,
  };
}

export async function getNotices(): Promise<Notice[]> {
  try {
    const { data } = await api.get<Notice[]>("/notices");
    return data;
  } catch (error) {
    const apiError = getApiError(error, "Failed to load notices");
    throw new Error(apiError.message);
  }
}

export async function getNoticeById(
  id: number | string,
  baseUrl?: string,
): Promise<Notice> {
  try {
    const { data } = baseUrl
      ? await axios.get<Notice>(`${baseUrl}/api/notices/${id}`)
      : await api.get<Notice>(`/notices/${id}`);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error("NOT_FOUND");
    }

    const apiError = getApiError(error, "Failed to load notice");
    throw new Error(apiError.message);
  }
}

export async function createNotice(payload: NoticeInput): Promise<Notice> {
  try {
    const { data } = await api.post<Notice>("/notices", payload);
    return data;
  } catch (error) {
    throw getApiError(error, "Failed to create notice");
  }
}

export async function updateNotice(
  id: number,
  payload: NoticeInput,
): Promise<Notice> {
  try {
    const { data } = await api.put<Notice>(`/notices/${id}`, payload);
    return data;
  } catch (error) {
    throw getApiError(error, "Failed to update notice");
  }
}

export async function deleteNotice(id: number): Promise<void> {
  try {
    await api.delete(`/notices/${id}`);
  } catch (error) {
    const apiError = getApiError(error, "Failed to delete notice");
    throw new Error(apiError.message);
  }
}
