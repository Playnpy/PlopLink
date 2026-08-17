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
    return `Vidéo YouTube (${videoId || "Lien"})`;
  } catch {
    return "Vidéo YouTube";
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FRENCH_PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

/**
 * Devine la catégorie d'un texte collé (lien YouTube, Maps, email, téléphone, URL...).
 * Retourne "Texte" par défaut si rien de plus spécifique n'est détecté.
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
    return "Mail";
  }
  if (FRENCH_PHONE_REGEX.test(trimmed.replace(/\s+/g, ""))) {
    return "Téléphone";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return "Liens web";
  }
  return "Texte";
}
