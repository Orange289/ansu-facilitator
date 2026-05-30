import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import createNextIntlPlugin from "next-intl/plugin"

const __dirname = dirname(fileURLToPath(import.meta.url))
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/** @type {import("next").NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
