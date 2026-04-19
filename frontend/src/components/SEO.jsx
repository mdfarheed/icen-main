import React from "react";
import { Helmet } from "react-helmet-async";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&w=1200&q=80";

/**
 * SEO component — sets <title>, meta description, OG, Twitter card per page.
 */
export default function SEO({
  title,
  description = "ICEN — International Council for Emerging Nations. A global council where emerging nations shape the future together.",
  image = DEFAULT_IMAGE,
  path = "",
  type = "website",
  keywords = "ICEN, emerging nations, global council, multilateralism, policy, sovereignty, international institution",
}) {
  const fullTitle = title ? `${title} — ICEN` : "ICEN — International Council for Emerging Nations";
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ICEN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* JSON-LD organization */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ICEN — International Council for Emerging Nations",
        url: BASE_URL,
        logo: DEFAULT_IMAGE,
        sameAs: [],
        foundingDate: "2026",
      })}</script>
    </Helmet>
  );
}
