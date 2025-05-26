/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'clfbzmtvnfiltzdmfuvy.supabase.co',
      'v5.airtableusercontent.com',
      'via.placeholder.com',
      'picsum.photos',
      'images.unsplash.com'
    ],
  },
}

module.exports = nextConfig 