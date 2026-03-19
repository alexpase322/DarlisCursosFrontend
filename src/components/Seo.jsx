import { useEffect } from "react";

const DEFAULT_IMAGE = "/social-preview.svg";

const getSiteOrigin = () => window.location.origin;

const toAbsoluteUrl = (value) => {
  if (!value) return "";
  return new URL(value, getSiteOrigin()).toString();
};

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const Seo = ({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  robots = "index,follow",
  jsonLd,
}) => {
  useEffect(() => {
    const canonicalPath = path ?? window.location.pathname;
    const canonicalUrl = toAbsoluteUrl(canonicalPath);
    const absoluteImage = toAbsoluteUrl(image);

    document.title = title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });

    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });

    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });

    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Arquitecta de tu Propio Éxito",
    });

    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "es_ES",
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });

    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });

    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });

    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: absoluteImage,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: absoluteImage ? "summary_large_image" : "summary",
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });

    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: absoluteImage,
    });

    if (jsonLd) {
      let script = document.head.querySelector('script[data-seo-jsonld="true"]');

      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(jsonLd);
    }
  }, [description, image, jsonLd, path, robots, title, type]);

  return null;
};

export default Seo;
