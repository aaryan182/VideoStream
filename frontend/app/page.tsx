"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FileUpload from "./components/FileUpload";
import VideoPlayer from "./components/VideoPlayer";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95 px-4 py-12">
      <h1 className="text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300 animate-float">
        Video Upload Service
      </h1>

      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="gradient-border bg-black/40 backdrop-blur-sm p-8 transition-all duration-300 hover:transform hover:scale-[1.02]">
          <div className="space-y-6">
            <FileUpload
              onUploadStart={() => {
                setIsUploading(true);
                setError(null);
              }}
              onUploadProgress={(progress) => setUploadProgress(progress)}
              onUploadComplete={(url) => {
                setVideoUrl(url);
                setIsUploading(false);
              }}
              onUploadError={(err) => {
                setError(err);
                setIsUploading(false);
              }}
            />

            {isUploading && (
              <div className="space-y-3">
                <Progress
                  value={uploadProgress}
                  className="h-2 bg-secondary glow-effect"
                />
                <p className="text-sm text-green-400 text-center animate-pulse">
                  Uploading and processing video... {Math.round(uploadProgress)}
                  %
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-md text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
          </div>
        </Card>

        {videoUrl && (
          <Card className="gradient-border bg-black/40 backdrop-blur-sm p-8 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-green-400">
              Preview
            </h2>
            <VideoPlayer src={videoUrl} />
          </Card>
        )}
      </div>
    </main>
  );
}
