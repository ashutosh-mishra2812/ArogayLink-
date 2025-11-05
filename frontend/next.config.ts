import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  // Add your custom webpack configuration
  webpack: (config) => {
    // 👇 Fix for Vue-based N8N Chat feature flags warning
    config.plugins.push(
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      })
    );

    return config;
  },
};

export default nextConfig;
