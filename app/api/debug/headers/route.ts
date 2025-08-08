export async function GET(req: Request) {
  return new Response(JSON.stringify({
    hasHeader: !!(req.headers.get("cf-access-jwt-assertion")),
    hasCookie: /CF_Authorization=/.test(req.headers.get("cookie") || "")
  }), { headers: { "content-type": "application/json" } });
}
