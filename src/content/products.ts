export type LiveProduct = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  description: string;
  /** Features taken from each site's own pages. */
  highlights: string[];
};

// Products running in production with private code, so they link to the live site only.
// Descriptions were checked against each site on 2026-10-27.
export const liveProducts: LiveProduct[] = [
  {
    slug: "wmeet",
    name: "W-Meet",
    domain: "wmeet.cc",
    url: "https://www.wmeet.cc",
    description:
      "Video meetings in the browser with no downloads: HD video, screen sharing, live chat, recording and custom branding, with Google or email sign-in.",
    highlights: ["Video calls", "Screen sharing", "Live chat", "Recording"],
  },
  {
    slug: "compressimages",
    name: "CompressImages",
    domain: "compressimages.cc",
    url: "https://www.compressimages.cc",
    description:
      "45 free PDF and image tools in one place: merge, split, compress, convert to and from Word, Excel and images, OCR, sign and redact. No signup and no watermark.",
    highlights: ["PDF tools", "Image compression", "OCR", "File conversion"],
  },
  {
    slug: "downloadvideo",
    name: "downloadvideo.cc",
    domain: "downloadvideo.cc",
    url: "https://downloadvideo.cc",
    description:
      "Video downloader for YouTube, Instagram, TikTok and Facebook with MP4 and MP3 output up to 4K, plus an in-browser tool that crops and splits clips for Reels and Shorts.",
    highlights: ["Parallel downloads", "MP4 + MP3", "In-browser video editing"],
  },
  {
    slug: "temporaryemail",
    name: "Temp Mail",
    domain: "temporaryemail.cc",
    url: "https://www.temporaryemail.cc",
    description:
      "Disposable inboxes in one click that receive mail in seconds, pull out verification codes, and render messages in a sandbox. Includes a self-destructing 10 minute inbox.",
    highlights: ["Live inbox", "OTP detection", "Sandboxed email"],
  },
];
