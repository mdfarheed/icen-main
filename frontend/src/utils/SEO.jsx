import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "ICEN";
const SITE_URL = "https://theicen.org";
const DEFAULT_IMAGE = "https://theicen.org/og-image.png";
const DEFAULT_FAVICON = "https://theicen.org/logo.jpg";

export default function SEO({
    title = "ICEN — International Council for Emerging Nations",
    description = "ICEN is a global council empowering emerging nations through sovereignty, diplomacy, technology, infrastructure, policy innovation, and international collaboration.",
    keywords = "ICEN, International Council for Emerging Nations, emerging nations, sovereignty, diplomacy, international policy, global governance, multilateralism, economic development",
    path = "/",
    image = DEFAULT_IMAGE,
    type = "website",
    author = "ICEN",
    robots = "index, follow",
    schema = null,
}) {
    const canonicalUrl = `${SITE_URL}${path}`;

    return (
        <Helmet prioritizeSeoTags>
            {/* =========================
                BASIC SEO
            ========================== */}
            <title>{title}</title>

            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <meta name="robots" content={robots} />
            <meta
                name="googlebot"
                content="index, follow, max-image-preview:large"
            />

            {/* =========================
                CANONICAL
            ========================== */}
            <link rel="canonical" href={canonicalUrl} />

            {/* =========================
                FAVICON
            ========================== */}
            <link rel="icon" type="image/png" href={DEFAULT_FAVICON} />
            <link rel="apple-touch-icon" href={DEFAULT_FAVICON} />

            {/* =========================
                OPEN GRAPH
            ========================== */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={image} />

            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* =========================
                TWITTER
            ========================== */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* =========================
                MOBILE / UI
            ========================== */}
            <meta name="theme-color" content="#0A1628" />

            {/* =========================
                DEFAULT ORGANIZATION SCHEMA
            ========================== */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "ICEN",
                    alternateName:
                        "International Council for Emerging Nations",
                    url: SITE_URL,
                    logo: DEFAULT_FAVICON,
                    description:
                        "A global council where emerging nations shape the future together.",
                    areaServed: "Worldwide",
                })}
            </script>

            {/* =========================
                PAGE SCHEMA (OPTIONAL)
            ========================== */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}