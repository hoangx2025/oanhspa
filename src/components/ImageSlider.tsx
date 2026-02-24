"use client";

import { extractYoutubeId } from "@/utils/youtube";
import { useEffect, useRef, useState } from "react";


export default function ImageSlider({
  images,
  altBase,
  youtubeUrl,
}: {
  images: string[];
  altBase: string;
  youtubeUrl?: string;
}) {
  const [index, setIndex] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoId = extractYoutubeId(youtubeUrl);

  // Auto slide (chỉ khi đang xem ảnh)
  useEffect(() => {
    if (!showVideo) startAuto();
    return stopAuto;
  }, [index, showVideo]);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
  };

  const stopAuto = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <>
      {/* Main image container (GIỮ IMG để giữ kích thước) */}
      <div
        className="main-image"
        onMouseEnter={stopAuto}
        onMouseLeave={() => !showVideo && startAuto()}
        style={{
          position: "relative",
          overflow: "hidden",
          border:0,
          background: "#000",
        }}
      >
        {/* IMG luôn tồn tại để giữ height/layout */}
        <img
          src={images[index]}
          alt={`${altBase} - ảnh ${index + 1}`}
          onClick={() => !showVideo && setShowFull(true)}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            // Khi xem video: ẩn ảnh nhưng vẫn giữ layout
            opacity: showVideo ? 0 : 1,
            pointerEvents: showVideo ? "none" : "auto",
            cursor: showVideo ? "default" : "zoom-in",
          }}
        />

        {/* IFRAME overlay lên trên ảnh */}
        {showVideo && videoId && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        )}

        {/* Expand icon (chỉ khi là ảnh) */}
        {!showVideo && (
          <button
            className="expand-btn"
            onClick={() => setShowFull(true)}
            aria-label="Xem ảnh lớn"
          >
            ⛶
          </button>
        )}

        {/* Nav buttons (chỉ khi là ảnh) */}
        {!showVideo && (
          <>
            <button
              className="nav-btn left"
              onClick={() =>
                setIndex((i) => (i - 1 + images.length) % images.length)
              }
            >
              ‹
            </button>

            <button
              className="nav-btn right"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="thumb-list">
        {images.map((img, i) => (
          <div
            key={i}
            className={`thumb-item ${!showVideo && i === index ? "active" : ""}`}
            onClick={() => {
              setIndex(i);
              setShowVideo(false);
            }}
          >
            <img src={img} alt={`thumb-${i}`} />
          </div>
        ))}

        {/* Video thumb (nằm đúng ô khoanh đỏ) */}
        {videoId && (
          <div
            className={`thumb-item video-thumb ${showVideo ? "active" : ""}`}
            onClick={() => {
              stopAuto();
              setShowVideo(true);
            }}
            style={{ position: "relative" }}
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="video-thumb"
            />
            <span className="play-icon">▶</span>
          </div>
        )}
      </div>

      {/* Fullscreen preview (chỉ ảnh) */}
      {showFull && !showVideo && (
        <div className="image-modal" onClick={() => setShowFull(false)}>
          <img src={images[index]} alt="preview" />
          <span className="close-btn">✕</span>
        </div>
      )}
    </>
  );
}
