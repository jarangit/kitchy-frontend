import type { ReactNode } from "react";
import Layout from "@/shared/components/layout/layout";

interface Props {
  children?: ReactNode;
}

export function KdsLayout({ children }: Props) {
  return (
    <Layout noPadding fullViewport hideAppBar>
      {children}
    </Layout>
  );
}
