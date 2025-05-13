import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
});

export const fetchDeepCdr = (dataId: string) =>
  API.get<{
    sanitized: {
      result: string;
      file_path: string;
      progress_percentage: number;
    };
    process_info: any;
  }>(`/file/${dataId}/cdr`);
