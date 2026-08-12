import type { Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/shared/i18n/language-context";
import { store } from "@/shared/store/store";
import "../src/app/index.css";

type Theme = "light" | "dark";

function ThemeScope({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light", icon: "circlehollow" },
          { value: "dark", title: "Dark", icon: "circle" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as Theme) ?? "light";
      return (
        <ThemeScope theme={theme}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <LanguageProvider>
                <MemoryRouter>
                  <Story />
                </MemoryRouter>
              </LanguageProvider>
            </QueryClientProvider>
          </Provider>
        </ThemeScope>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
