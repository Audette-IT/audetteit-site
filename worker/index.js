// Runs only for the HTML page routes listed in assets.run_worker_first
// (wrangler.jsonc); everything else is served straight from public/.
//
// Clients that send `Accept: text/markdown` get the page's Markdown twin
// (public/<page>.md) instead of the HTML — a free-tier stand-in for
// Cloudflare's paid "Markdown for Agents" zone feature (GitHub issue #43).

// public/_headers is NOT applied to responses that pass through Worker code,
// so these are set here. Keep in sync with the "/*" block in public/_headers.
const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'sha256-UyV5Au11KVQu7NJLru7rrbyHqm2Q7abUOBcVvlNvgFo=' https://*.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://*.google-analytics.com https://*.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src https://www.googletagmanager.com; manifest-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000",
};

// Page path -> Markdown twin. Must match run_worker_first in wrangler.jsonc.
const MARKDOWN_PAGES = {
  "/": "/index.md",
  "/services": "/services.md",
  "/contact": "/contact.md",
  "/privacy": "/privacy.md",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // One canonical host: www.audetteit.com -> audetteit.com, same path/query.
    if (url.hostname === "www.audetteit.com") {
      url.protocol = "https:";
      url.hostname = "audetteit.com";
      return Response.redirect(url.toString(), 301);
    }

    const mdPath = MARKDOWN_PAGES[url.pathname];
    const wantsMarkdown = (request.headers.get("Accept") || "").includes("text/markdown");

    let response;
    if (mdPath && wantsMarkdown) {
      const md = await env.ASSETS.fetch(new URL(mdPath, url));
      response = new Response(md.body, { status: md.status });
      response.headers.set("Content-Type", "text/markdown; charset=utf-8");
      response.headers.set("Link", `<https://audetteit.com${url.pathname}>; rel="canonical"`);
    } else {
      const asset = await env.ASSETS.fetch(request);
      response = new Response(asset.body, asset);
    }

    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(name, value);
    }
    // Same URL, two representations — caches must key on Accept.
    response.headers.append("Vary", "Accept");
    return response;
  },
};
