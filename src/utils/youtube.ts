// utils/youtube.ts
export function extractYoutubeId(url?: string) {
  if (!url) return null;

  const u = url.trim();

  // watch?v=ID
  let match = u.match(/[?&]v=([^&]+)/);
  if (match?.[1]) return match[1];

  // youtu.be/ID
  match = u.match(/youtu\.be\/([^?&]+)/);
  if (match?.[1]) return match[1];

  // youtube.com/shorts/ID (kể cả ?feature=share)
  match = u.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (match?.[1]) return match[1];

  // youtube.com/embed/ID
  match = u.match(/youtube\.com\/embed\/([^?&]+)/);
  if (match?.[1]) return match[1];

  return null;
}
