import { createContext, useContext, useState, type ReactNode } from "react";
import Layout from "@/shared/components/layout/layout";

interface KdsLayoutState {
  fullscreen: boolean;
  toggleFullscreen: () => void;
}

const KdsLayoutContext = createContext<KdsLayoutState>({
  fullscreen: false,
  toggleFullscreen: () => {},
});

interface Props {
  children?: ReactNode;
}

export function KdsLayout({ children }: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <KdsLayoutContext.Provider
      value={{
        fullscreen,
        toggleFullscreen: () => setFullscreen((value) => !value),
      }}
    >
      <Layout noPadding fullViewport hideAppBar hideSidebar={fullscreen}>
        {children}
      </Layout>
    </KdsLayoutContext.Provider>
  );
}

export function useKdsLayout() {
  return useContext(KdsLayoutContext);
}
