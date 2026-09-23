// Runs only for "/" (see assets.run_worker_first in wrangler.jsonc); every
// other path is served straight from public/ as a static asset.
//
// Serves a Markdown version of the homepage to clients that ask for it with
// `Accept: text/markdown` — a free-tier stand-in for Cloudflare's paid
// "Markdown for Agents" zone feature (GitHub issue #43).

// public/_headers is NOT applied to responses that pass through Worker code,
// so "/" sets these itself. Keep in sync with the "/*" block in public/_headers.
const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; manifest-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000",
};

const MARKDOWN = `# Audette IT

Uptime isn't luck. It's a system someone is actually watching.

Audette IT is one person who knows what they're doing — from forgotten passwords to full network and Active Directory builds, for family and friends who'd rather not guess.

## Coverage

- **Everyday help** — wifi and device troubleshooting, slow computers, printers, locked-out accounts, parental controls on the kids' devices.
- **Infrastructure & advanced** — home network design, Active Directory and domain setups, self-hosted services, real security hardening.

See [services](/services) for the full list, or [contact](/contact) to get in touch.
`;

export default {
  async fetch(request, env) {
    const accept = request.headers.get("Accept") || "";

    let response;
    if (accept.includes("text/markdown")) {
      response = new Response(MARKDOWN, {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
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
