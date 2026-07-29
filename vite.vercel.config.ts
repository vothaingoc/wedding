import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { wedding } from "./src/config/wedding";

const description =
  "皆様にお越しいただけることが、私たち家族にとって何よりの光栄です。";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || wedding.publicUrl).replace(/\/$/, "");
  const title = `${wedding.groomName} & ${wedding.brideName} Wedding Invitation`;

  return {
    plugins: [
      react(),
      {
        name: "wedding-metadata",
        transformIndexHtml(html) {
          return html
            .replaceAll("__WEDDING_TITLE__", title)
            .replaceAll("__WEDDING_DESCRIPTION__", description)
            .replaceAll("__SITE_URL__", siteUrl)
            .replaceAll("__OG_IMAGE__", `${siteUrl}${wedding.ogImage}`);
        },
      },
    ],
    build: {
      outDir: "dist-vercel",
      emptyOutDir: true,
    },
  };
});
