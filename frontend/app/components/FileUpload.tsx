"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface FileUploadProps {
  onUploadStart: () => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
}

export default function FileUpload({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      onUploadStart();

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8000/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onUploadProgress(progress);
        }
      };

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete(response.videoUrl);
        } else {
          onUploadError("Upload failed. Please try again.");
        }
      };

      xhr.onerror = function () {
        onUploadError("Network error occurred. Please try again.");
      };

      xhr.send(formData);
    } catch (error) {
      onUploadError("An error occurred during upload. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      <Button
        size="lg"
        onClick={() => fileInputRef.current?.click()}
        className="w-full max-w-xs bg-green-500 hover:bg-green-400 transition-all duration-300 
                 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transform hover:scale-105
                 text-white font-semibold py-6"
      >
        <Upload className="mr-2 h-5 w-5 animate-bounce" />
        Select Video
      </Button>

      <div
        className="text-sm text-green-400/80 text-center bg-green-500/10 backdrop-blur-sm 
                    rounded-lg p-4 border border-green-500/20"
      >
        <p className="font-medium">Supported formats:</p>
        <p className="mt-1 text-green-400/60">MP4, WebM, MOV (max 30MB)</p>
      </div>
    </div>
  );
}
