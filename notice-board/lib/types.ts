export type Notice = {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  image: string | null;
  createdAt: string;
};

export type ApiError = {
  message: string;
  errors?: { field: string; message: string }[];
};
