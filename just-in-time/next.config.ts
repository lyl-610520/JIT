import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
};

export default withPWA({
  dest: "public",
  register: true,
  disable: false,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === "document",
        handler: "NetworkFirst",
        options: {
          cacheName: "html-cache",
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: ({ request }) => request.destination === "script" || request.destination === "style",
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "asset-cache",
        },
      },
      {
        urlPattern: ({ request }) => request.destination === "image" || request.destination === "font",
        handler: "CacheFirst",
        options: {
          cacheName: "static-cache",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        urlPattern: ({ request }) => request.destination === "audio",
        handler: "CacheFirst",
        options: {
          cacheName: "audio-cache",
          expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
})(nextConfig);
