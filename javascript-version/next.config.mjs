/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  reactStrictMode: false, // This can help reduce hydration warnings
  experimental: {
    suppressHydrationWarning: true
  }
}

export default nextConfig
