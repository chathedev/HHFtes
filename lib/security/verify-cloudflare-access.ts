import 'server-only'

type JWKS = { keys: Array<Record<string, any>> }

function base64urlToUint8Array(input: string) {
  input = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = input.length % 4
  if (pad) input += '='.repeat(4 - pad)
  const str = Buffer.from(input, 'base64')
  return new Uint8Array(str)
}

function decodeJwt(token: string) {
  const [h, p, s] = token.split('.')
  if (!h || !p || !s) throw new Error('Malformed JWT')
  const header = JSON.parse(Buffer.from(h, 'base64url').toString())
  const payload = JSON.parse(Buffer.from(p, 'base64url').toString())
  const signature = base64urlToUint8Array(s)
  const data = new TextEncoder().encode(`${h}.${p}`)
  return { header, payload, signature, data }
}

async function importJwk(alg: string, jwk: JsonWebKey) {
  if (alg === 'RS256') {
    return crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    )
  }
  if (alg === 'ES256') {
    return crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    )
  }
  throw new Error(`Unsupported alg ${alg}`)
}

async function verifySignature(alg: string, key: CryptoKey, data: Uint8Array, signature: Uint8Array) {
  if (alg === 'RS256') {
    return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data)
  }
  if (alg === 'ES256') {
    return crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, signature, data)
  }
  return false
}

/**
 * Verifies a Cloudflare Access JWT via JWKS.
 * Requires env CF_TEAM_DOMAIN and CF_ACCESS_AUD.
 */
export async function verifyCloudflareAccess(token: string) {
  if (!token) throw new Error('Missing token')
  const CF_TEAM_DOMAIN = process.env.CF_TEAM_DOMAIN
  const CF_ACCESS_AUD = process.env.CF_ACCESS_AUD
  if (!CF_TEAM_DOMAIN || !CF_ACCESS_AUD) {
    throw new Error('Missing CF env')
  }

  const { header, payload, signature, data } = decodeJwt(token)
  const iss = `https://${CF_TEAM_DOMAIN}.cloudflareaccess.com`
  if (payload.iss !== iss) throw new Error('Invalid issuer')
  const audOk = Array.isArray(payload.aud)
    ? payload.aud.includes(CF_ACCESS_AUD)
    : payload.aud === CF_ACCESS_AUD
  if (!audOk) throw new Error('Invalid audience')
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && now >= payload.exp) throw new Error('Token expired')

  const jwksUrl = `${iss}/cdn-cgi/access/certs`
  const jwks: JWKS = await fetch(jwksUrl, { cache: 'force-cache' }).then((r) => r.json())
  const jwk = jwks.keys.find((k) => k.kid === header.kid)
  if (!jwk) throw new Error('Key not found')

  const key = await importJwk(header.alg, jwk as any)
  const ok = await verifySignature(header.alg, key, data, signature)
  if (!ok) throw new Error('Bad signature')

  return true
}
