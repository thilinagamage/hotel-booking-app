"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setUploadedUrl(data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-6 text-white shadow-lg backdrop-blur">
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-white/80 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
        />
        <button
          type="submit"
          disabled={!file || uploading}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload to S3"}
        </button>
      </form>

      {uploadedUrl ? (
        <div className="mt-4 text-sm text-white/80">
          <p>Uploaded file URL:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noreferrer"
            className="break-all text-cyan-300"
          >
            {uploadedUrl}
          </a>
        </div>
      ) : null}
    </div>
  );
}
