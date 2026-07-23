/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Users supply arbitrary avatar / thumbnail / product image hosts, plus
    // UploadThing (utfs.io) and YouTube thumbnails. Narrow this in production
    // if you lock uploads to a single provider.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  experimental: {
    // Server Actions body size for image-heavy block payloads.
    serverActions: { bodySizeLimit: '2mb' },
  },
}

export default nextConfig
