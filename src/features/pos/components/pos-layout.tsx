import { Outlet } from "react-router-dom";
import { CartProvider } from "@/features/pos/context/cartContext";
import Layout from "@/shared/components/layout/layout";

/**
 * POS layout route wrapper.
 * Provides CartProvider so cart state is shared across all POS sub-routes
 * (pos-home, payment, payment-success) without using location.state.
 */
export function PosLayout() {
  return (
    <CartProvider>
      <Layout noPadding hideSidebar>
        <Outlet />
      </Layout>
    </CartProvider>
  );
}
