import { jwtVerify, createRemoteJWKSet } from 'jose';

type JWKS = { keys: Array<Record<string, any>> }

export async function verifyCloudflareAccess(token: string) {
  if (!token) return false
  const CF_TEAM_DOMAIN = process.env.CF_TEAM_DOMAIN
  const CF_ACCESS_AUD = process.env.CF_ACCESS_AUD
  if (!CF_TEAM_DOMAIN || !CF_ACCESS_AUD) return false

  const ISSUER = `https://${CF_TEAM_DOMAIN}.cloudflareaccess.com`
  const JWKS_URL = `${ISSUER}/cdn-cgi/access/certs`

  try {
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: CF_ACCESS_AUD, // jose handles string or array aud claims
    });

    // Additional check for aud if jose's audience option isn't strict enough for specific needs
    // const aud = payload.aud as string | string[] | undefined;
    // const okAud = Array.isArray(aud) ? aud.includes(CF_ACCESS_AUD) : aud === CF_ACCESS_AUD;
    // return payload.iss === ISSUER && okAud;

    return true; // If jwtVerify succeeds, it means issuer, audience, and signature are valid
  } catch (error) {
    console.error("Cloudflare Access JWT verification failed:", error);
    return false;
  }
}
