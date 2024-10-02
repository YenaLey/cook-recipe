/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/cook-recipe",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
