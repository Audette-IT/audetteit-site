// Lightweight, free-tier stand-in for Cloudflare's paid "Markdown for
// Agents" feature: honors `Accept: text/markdown` on the homepage only.
// Everything else falls through to the normal static HTML.
export async function onRequestGet(context) {
  const { request, env } = context;
  const accept = request.headers.get("Accept") || "";

  if (accept.includes("text/markdown")) {
    const markdown = `# Audette IT

**We'll be right back**

Audette IT is currently undergoing scheduled maintenance while we work on some improvements. Thanks for your patience.

_Maintenance in progress_
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
