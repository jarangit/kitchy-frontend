import type { StorybookConfig } from "@storybook/react-vite";
import type { UserConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  viteFinal: async (viteConfig) => {
    const merged = viteConfig as UserConfig;
    merged.plugins = merged.plugins?.filter((plugin) => {
      const name = Array.isArray(plugin) ? plugin[0]?.name : plugin?.name;
      return !name?.startsWith("vite-plugin-pwa");
    });
    return merged;
  },
};

export default config;
