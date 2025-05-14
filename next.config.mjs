/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net',
        port: '',
        pathname: '/**'
      }
    ],
  },
};

module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

export default nextConfig;
