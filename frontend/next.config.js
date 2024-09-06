
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: ['api.dicebear.com', "lh3.googleusercontent.com"],
  },

};

module.exports = nextConfig;

