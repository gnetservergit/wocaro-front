import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static HTML/CSS/JS for shared hosting (FTP `out/` to the domain).
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true,
  sassOptions: {
    silenceDeprecations: [],
    sourceMap: true,
    sourceMapIncludeSources: true,
  },
  webpack: (config, { dev, isServer, webpack }) => {
    if (!dev || isServer) return config;

    const rules = config.module?.rules;
    if (Array.isArray(rules)) {
      const patchLoaders = (use: unknown) => {
        if (!use) return;
        for (const entry of Array.isArray(use) ? use : [use]) {
          if (!entry || typeof entry !== "object") continue;
          const u = entry as { loader?: string; options?: unknown };
          const path = String(u.loader ?? "");
          if (
            !path.includes("css-loader") &&
            !path.includes("postcss-loader") &&
            !path.includes("resolve-url-loader")
          ) {
            continue;
          }
          const prev =
            u.options && typeof u.options === "object" && !Array.isArray(u.options)
              ? (u.options as Record<string, unknown>)
              : {};
          u.options = { ...prev, sourceMap: true };
        }
      };
      const walk = (rs: unknown[]) => {
        for (const rule of rs) {
          if (!rule || typeof rule !== "object") continue;
          const r = rule as { oneOf?: unknown[]; rules?: unknown[]; use?: unknown };
          if (Array.isArray(r.oneOf)) walk(r.oneOf);
          if (Array.isArray(r.rules)) walk(r.rules);
          if (r.use) patchLoaders(r.use);
        }
      };
      walk(rules);
    }

    config.plugins ??= [];
    config.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        filename: "[file].map[query]",
        test: /\.css$/i,
      }),
    );
    return config;
  },
};

export default nextConfig;
