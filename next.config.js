/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 适配
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // 将 @cloudflare/next-on-pages 标记为外部模块
    // 这样 webpack 就不会尝试解析它，在运行时由 Cloudflare 环境提供
    const originalExternals = config.externals || []
    config.externals = [
      ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
      ({ request }, callback) => {
        if (request === '@cloudflare/next-on-pages') {
          // 标记为外部模块，在运行时由 Cloudflare 环境提供
          return callback(null, 'commonjs ' + request)
        }
        callback()
      }
    ]
    return config
  },
}

module.exports = nextConfig

