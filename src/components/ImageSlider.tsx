"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { extractYoutubeId } from "@/utils/youtube";

export default function ImageSlider({
  images,
  altBase,
  youtubeUrl,
  fit = "cover",
}: {
  images: string[];
  altBase: string;
  youtubeUrl?: string;
  fit?: "cover" | "contain";
}) {
  const safeImages = useMemo(
    () => (images || []).filter((x) => (x || "").trim().length > 0),
    [images],
  );

  const [index, setIndex] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoId = extractYoutubeId(youtubeUrl);

  useEffect(() => {
    if (!showVideo && safeImages.length > 1) startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, showVideo, safeImages.length]);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % safeImages.length);
    }, 3000);
  };

  const stopAuto = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  if (safeImages.length === 0) return null;

  return (
    <>
      <div
        className="main-image"
        onMouseEnter={stopAuto}
        onMouseLeave={() => !showVideo && startAuto()}
      >
        {/* IMG luôn tồn tại để giữ layout */}
        <Image
          src={safeImages[index]}
          alt={`${altBase} - ảnh ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 576px"
          onClick={() => !showVideo && setShowFull(true)}
          style={{
            opacity: showVideo ? 0 : 1,
            pointerEvents: showVideo ? "none" : "auto",
            cursor: showVideo ? "default" : "zoom-in",
            objectFit: fit,
          }}
        />

        {showVideo && videoId && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        )}

        {!showVideo && (
          <button className="expand-btn" onClick={() => setShowFull(true)} aria-label="Xem ảnh lớn" type="button">
            ⛶
          </button>
        )}

        {!showVideo && safeImages.length > 1 && (
          <>
            <button
              className="nav-btn left"
              onClick={() => setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)}
              type="button"
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <button
              className="nav-btn right"
              onClick={() => setIndex((i) => (i + 1) % safeImages.length)}
              type="button"
              aria-label="Ảnh sau"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="thumb-list">
        {safeImages.map((img, i) => (
          <button
            key={i}
            type="button"
            className={`thumb-item ${!showVideo && i === index ? "active" : ""}`}
            onClick={() => {
              setIndex(i);
              setShowVideo(false);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`${altBase} thumb ${i + 1}`} />
          </button>
        ))}

        {videoId && (
          <button
            type="button"
            className={`thumb-item video-thumb ${showVideo ? "active" : ""}`}
            onClick={() => {
              stopAuto();
              setShowVideo(true);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Video" />
            <span className="play-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 8.5V15.5L16 12L10 8.5Z" fill="white" />
              </svg>
            </span>
          </button>
        )}
      </div>

      {showFull && !showVideo && (
        <div className="image-modal" onClick={() => setShowFull(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={safeImages[index]} alt="preview" />
          <span className="close-btn">✕</span>
        </div>
      )}
    </>
  );
}
