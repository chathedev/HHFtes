import { createRemoteJWKSet, jwtVerify } from "jose"

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null

function getIssuer() {
  const domain = process.env.CF_TEAM_DOMAIN
  if (!domain) throw new Error("CF_TEAM_DOMAIN not set")
  return `https://${domain}.cloudflareaccess.com`
}

function getJwks() {
  if (!jwks) {
    const issuer = getIssuer()
    const url = new URL("/cdn-cgi/access/certs", issuer)
    jwks = createRemoteJWKSet(url)
  }
  return jwks
}

/**
 * Validates the "CF-Access-Jwt-Assertion" token issued by Cloudflare Access.
 * Ensures the audience and issuer match env configuration.
 */
export async function verifyCloudflareAccess(token: string): Promise<boolean> {
  try {
    if (!token) return false
    const aud = process.env.CF_ACCESS_AUD
    if (!aud) throw new Error("CF_ACCESS_AUD not set")

    const { payload, protectedHeader } = await jwtVerify(token, getJwks(), {
      audience: aud,
      issuer: getIssuer(),
    })

    // Basic extra checks (exp etc.) are handled by jose; we can add optional app-specific checks here.
    return Boolean(payload?.aud)
  } catch (err) {
    // console.debug("CF Access verification failed:", err)
    return false
  }
}
