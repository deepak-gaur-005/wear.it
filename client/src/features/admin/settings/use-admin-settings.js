import { useEffect, useMemo, useState } from "react";
import { getAdminBanners, uploadAdminBanners } from "./api";

export function useAdminSettings() {
  const [items, setItems] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function refreshBanners() {
    try {
      setLoading(true);

      const response = await getAdminBanners();
      setItems(response?.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshBanners();
  }, []);

  async function handleUpload() {
    try {
      if (!files.length) return;

      setUploading(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await uploadAdminBanners(formData);

      setItems(response?.items ?? []);
      setFiles([]);
    } catch (error) {
      console.error("Failed to upload admin banners:", error);
    } finally {
      setUploading(false);
    }
  }

  const fileCountLabel = useMemo(() => {
    if (!files.length) return "No files selected";

    if (files.length === 1) {
      return files[0].name;
    }

    return `${files.length} files selected`;
  }, [files]);

  return {
    items,
    files,
    setFiles,
    fileCountLabel,
    loading,
    setLoading,
    refreshBanners,
    handleUpload,
    uploading,
  };
}
