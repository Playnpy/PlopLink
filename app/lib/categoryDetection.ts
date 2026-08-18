import type { Category } from "@/app/types";

export function getYouTubeVideoTitle(url: string): string {
  try {
    const trimmed = url.trim();
    let videoId = "";
    if (trimmed.includes("v=")) {
      videoId = trimmed.split("v=")[1]?.split("&")[0] || "";
    } else if (trimmed.includes("youtu.be/")) {
      videoId = trimmed.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    if (videoId === "dQw4w9WgXcQ") return "Rick Astley - Never Gonna Give You Up";
    return `YouTube video (${videoId || "Link"})`;
  } catch {
    return "YouTube video";
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:(?:\+|00)\d{1,3})?\s*[1-9](?:[\s.-]*\d{2,4}){3,5}$/;

/**
 * Guesses the category of a pasted text (YouTube link, Maps, email, phone,
 * URL...). Falls back to "Text" if nothing more specific is detected.
 */
export function autoDetectCategory(text: string): Category {
  const trimmed = text.trim();

  if (
    trimmed.includes("http://googleusercontent.com/maps.google.com/") ||
    trimmed.includes("goo.gl/maps")
  ) {
    return "Google Maps";
  }
  if (trimmed.includes("youtube.com/") || trimmed.includes("youtu.be/")) {
    return "YouTube";
  }
  if (EMAIL_REGEX.test(trimmed)) {
    return "Email";
  }
  if (PHONE_REGEX.test(trimmed.replace(/\s+/g, ""))) {
    return "Phone";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return "Web Link";
  }
  return "Text";
}
