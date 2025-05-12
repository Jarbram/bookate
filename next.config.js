/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'via.placeholder.com',
      'v5.airtableusercontent.com',
      'picsum.photos',
      'images.unsplash.com'
    ],
  },
}

module.exports = nextConfig 