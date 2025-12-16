/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 适配
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // 在本地开发时，将 @cloudflare/next-on-pages 标记为外部模块
    // 这样 webpack 就不会尝试解析它
    if (process.env.NODE_ENV !== 'production') {
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push('@cloudflare/next-on-pages')
      } else {
        config.externals = [config.externals, '@cloudflare/next-on-pages']
      }
    }
    return config
  },
}

module.exports = nextConfig

