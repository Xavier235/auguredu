import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { LIBRARY_INDEX } from "@/lib/library-catalogue";

const BASE_URL = "https://auguredu.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/predictor", changefreq: "weekly", priority: "0.9" },
          { path: "/cgpa", changefreq: "weekly", priority: "0.9" },
          { path: "/library", changefreq: "weekly", priority: "0.9" },
          { path: "/study-plan", changefreq: "weekly", priority: "0.7" },
          { path: "/chat", changefreq: "weekly", priority: "0.7" },
          { path: "/exam", changefreq: "weekly", priority: "0.9" },
          { path: "/projects", changefreq: "weekly", priority: "0.8" },
          { path: "/campus", changefreq: "weekly", priority: "0.7" },
          { path: "/how-it-works", changefreq: "monthly", priority: "0.6" },
          { path: "/search", changefreq: "monthly", priority: "0.5" },
          { path: "/upgrade", changefreq: "monthly", priority: "0.5" },
          { path: "/auth", changefreq: "yearly", priority: "0.3" },
          ...LIBRARY_INDEX.map((e) => ({
            path: `/library/${e.id}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
