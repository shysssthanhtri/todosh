import type { MetadataRoute } from "next";

import { publicRoutes, ROUTES } from "@/constants/routes";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://todosh.shyss.space";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        ...Object.values(ROUTES).filter(
          (route) => !publicRoutes.includes(route),
        ),
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
