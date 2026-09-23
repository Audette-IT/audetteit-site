// Runs only for "/" (see assets.run_worker_first in wrangler.jsonc); every
// other path is served straight from public/.
//
// Clients that send `Accept: text/markdown` get public/index.md instead of
// the HTML — a free-tier stand-in for Cloudflare's paid "Markdown for Agents"
// zone feature (GitHub issue #43).

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const wantsMarkdown = (request.headers.get("Accept") || "").includes("text/markdown");

    let response;
    if (wantsMarkdown) {
      const md = await env.ASSETS.fetch(new URL("/index.md", url));
      response = new Response(md.body, { status: md.status });
      response.headers.set("Content-Type", "text/markdown; charset=utf-8");
      response.headers.set("Link", '<https://audetteit.com/>; rel="canonical"');
    } else {
      const asset = await env.ASSETS.fetch(request);
      response = new Response(asset.body, asset);
    }
    // Same URL, two representations — caches must key on Accept.
    response.headers.append("Vary", "Accept");
    return response;
  },
};
