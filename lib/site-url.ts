const normalizeHost = (input: string) => {
  if (/^https?:\/\//i.test(input)) {
    return input
  }
  return `https://${input}`
}

export const getSiteUrl = () => {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"

  return normalizeHost(rawUrl).replace(/\/$/, "")
}
