const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    ...(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ? { loader: "custom", loaderFile: "./app/lib/cloudinary-loader.js" }
      : {}),
    remotePatterns: [
      { protocol: "https", hostname: "st-daikin.mncdn.com" },
      { protocol: "https", hostname: "klima.mitsubishielectric.com.tr" },
      { protocol: "https", hostname: "www.bosch-homecomfort.com" },
      { protocol: "https", hostname: "images.samsung.com" },
      { protocol: "https", hostname: "statics.vestel.com.tr" },
    ],
  },
};

export default nextConfig;
