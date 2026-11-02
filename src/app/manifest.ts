import type { MetadataRoute } from "next";

// Lets phones install Astrabela as an app: an icon on the home screen that opens without browser bars.
// start_url "/" goes through the language redirect, so the app opens in the phone's language.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Astrabela",
    short_name: "Astrabela",
    description: "Book the best. Trust the stars.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8f5ef",
    theme_color: "#ffffff",
    icons: [
      { src: "/app/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
