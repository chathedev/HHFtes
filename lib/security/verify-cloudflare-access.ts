import { jwtVerify, createRemoteJWKSet } from 'jose'

export async function verifyCloudflareAccess(token: string): Promise<boolean> {
  if (!process.env.CF_TEAM_DOMAIN || !process.env.CF_ACCESS_AUD) {
    console.error("Missing Cloudflare Access environment variables.")
    return false
  }

  const ISSUER = `https://${process.env.CF_TEAM_DOMAIN}`
  const JWKS_URL = `${ISSUER}/cdn-cgi/access/certs`

  try {
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL))
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: process.env.CF_ACCESS_AUD, // jose's audience option handles string or array
    })

    // Additional checks if needed, though jose handles issuer and audience
    return true
  } catch (error) {
    console.error("JWT verification failed:", error)
    return false
  }
}
