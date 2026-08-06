// Shared SEO helpers: canonical site data, social preview image and JSON-LD
// builders for the academic services Augur offers.

export const SITE_URL = "https://auguredu.lovable.app";
export const SITE_NAME = "Augur.edu";

/** Absolute social preview image used for rich link previews. */
export const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1c173c73-4dfa-4362-a337-0c01592359ab/id-preview-cd263886--a832dfc8-c32b-4bf8-886b-e39fb99b941b.lovable.app-1782738264908.png";

type SocialArgs = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
};

/** Full per-page meta block: title, description, canonical-friendly og + twitter. */
export function pageMeta({ title, description, path, type = "website", image = OG_IMAGE }: SocialArgs) {
  const url = `${SITE_URL}${path}`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export function canonical(path: string) {
  return [{ rel: "canonical", href: `${SITE_URL}${path}` }];
}

function ld(data: Record<string, unknown>) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

/** Organisation + site search, used on the home page. */
export function organisationJsonLd() {
  return [
    ld({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      alternateName: "Augur",
      url: SITE_URL,
      logo: OG_IMAGE,
      description:
        "Augur.edu helps Nigerian students predict admission chances, forecast CGPA and study every NUC course with an AI study buddy.",
      areaServed: { "@type": "Country", name: "Nigeria" },
    }),
    ld({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    }),
  ];
}

/** Describes one academic service (predictor, forecaster, library, AI tutor). */
export function serviceJsonLd(args: { name: string; description: string; path: string; serviceType: string }) {
  return [
    ld({
      "@context": "https://schema.org",
      "@type": "Service",
      name: args.name,
      serviceType: args.serviceType,
      description: args.description,
      url: `${SITE_URL}${args.path}`,
      provider: { "@type": "EducationalOrganization", name: SITE_NAME, url: SITE_URL },
      areaServed: { "@type": "Country", name: "Nigeria" },
      audience: { "@type": "EducationalAudience", educationalRole: "student" },
    }),
  ];
}

/** Describes a single readable course in the library. */
export function courseJsonLd(args: {
  code: string;
  title: string;
  description: string;
  path: string;
  department: string;
}) {
  return [
    ld({
      "@context": "https://schema.org",
      "@type": "Course",
      name: `${args.code} — ${args.title}`,
      courseCode: args.code,
      description: args.description,
      url: `${SITE_URL}${args.path}`,
      inLanguage: "en-NG",
      educationalLevel: "Undergraduate",
      teaches: args.department,
      provider: { "@type": "EducationalOrganization", name: SITE_NAME, url: SITE_URL },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT30M",
      },
    }),
  ];
}
