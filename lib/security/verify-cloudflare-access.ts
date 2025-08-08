import { jwtVerify, createRemoteJWKSet } from 'jose'

export async function verifyCloudflareAccess(token: string): Promise<boolean> {
  if (!process.env.CF_TEAM_DOMAIN || !process.env.CF_ACCESS_AUD) {
    console.error("Missing Cloudflare Access environment variables.")
    return false
  }

  const ISSUER = `https://${process.env.CF_TEAM_DOMAIN}.cloudflareaccess.com`
  const JWKS_URL = `${ISSUER}/cdn-cgi/access/certs`

  try {
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL))
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: process.env.CF_ACCESS_AUD, // jose's audience option handles string or array
    })

    // The `audience` option in `jwtVerify` already handles both string and array
    // comparison against the provided `CF_ACCESS_AUD`.
    // If `jwtVerify` completes without throwing, it means issuer, audience, and signature are valid.
    return true
  } catch (error) {
    console.error("JWT verification failed:", error)
    return false
  }
}
