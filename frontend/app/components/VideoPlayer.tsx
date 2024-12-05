"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import hlsQualitySelector from "videojs-hls-quality-selector";

// Register the plugin manually
videojs.registerPlugin("hlsQualitySelector", hlsQualitySelector);

interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      fluid: true,
      responsive: true,
      html5: {
        hls: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
        },
      },
      sources: [
        {
          src: src,
          type: "application/x-mpegURL",
        },
      ],
      plugins: {
        hlsQualitySelector: {}, // Activate plugin
      },
      playbackRates: [0.5, 1, 1.5, 2],
      controlBar: {
        children: [
          "playToggle",
          "volumePanel",
          "currentTimeDisplay",
          "timeDivider",
          "durationDisplay",
          "progressControl",
          "qualitySelector",
          "playbackRateMenuButton",
          "fullscreenToggle",
        ],
      },
    });

    playerRef.current.ready(() => {
      playerRef.current.hlsQualitySelector();
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div className="relative rounded-lg overflow-hidden glow-effect video-container">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-button-centered vjs-theme-forest"
        />
      </div>
      <style jsx global>{`
        .video-container .video-js {
          width: 100%;
          height: 100%;
          aspect-ratio: 16/9;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
        }

        .video-js .vjs-control-bar {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }

        .video-js .vjs-big-play-button {
          background: rgba(16, 185, 129, 0.8);
          border: none;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          line-height: 80px;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }

        .video-js:hover .vjs-big-play-button {
          background: rgba(16, 185, 129, 1);
          transform: scale(1);
        }

        .video-js .vjs-progress-holder .vjs-play-progress {
          background: rgb(16, 185, 129);
        }

        .video-js .vjs-progress-holder .vjs-load-progress {
          background: rgba(16, 185, 129, 0.3);
        }

        .video-js .vjs-slider:focus {
          text-shadow: 0 0 1em rgb(16, 185, 129);
          box-shadow: 0 0 1em rgb(16, 185, 129);
        }

        .video-js .vjs-control:focus {
          text-shadow: 0 0 1em rgb(16, 185, 129);
        }

        .video-js .vjs-menu-button-popup .vjs-menu {
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 0.5rem;
        }

        .video-js .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
          background: transparent;
        }

        .video-js .vjs-menu li.vjs-selected,
        .video-js .vjs-menu li.vjs-menu-item:focus,
        .video-js .vjs-menu li.vjs-menu-item:hover {
          background: rgba(16, 185, 129, 0.5);
          color: white;
        }
      `}</style>
    </div>
  );
}
