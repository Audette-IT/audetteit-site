// Lightweight, free-tier stand-in for Cloudflare's paid "Markdown for
// Agents" feature: honors `Accept: text/markdown` on the homepage only.
// Everything else falls through to the normal static HTML.
export async function onRequestGet(context) {
  const { request, env } = context;
  const accept = request.headers.get("Accept") || "";

  if (accept.includes("text/markdown")) {
    const markdown = `# Audette IT

Uptime isn't luck. It's a system someone is actually watching.

Audette IT is one person who knows what they're doing — from forgotten passwords to full network and Active Directory builds, for family and friends who'd rather not guess.

## Coverage

- **Everyday help** — wifi and device troubleshooting, slow computers, printers, locked-out accounts, parental controls on the kids' devices.
- **Infrastructure & advanced** — home network design, Active Directory and domain setups, self-hosted services, real security hardening.

See [services.html](/services.html) for the full list, or [contact.html](/contact.html) to get in touch.
`;
    return new Response(markdown, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        vary: "Accept",
      },
    });
  }

  return env.ASSETS.fetch(request);
}
