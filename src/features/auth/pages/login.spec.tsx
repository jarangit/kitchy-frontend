import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LanguageProvider } from "@/shared/i18n/language-context";
import { AuthContext } from "@/features/auth/context/auth-context";
import type { IAuthContext } from "@/features/auth/types/auth.model";
import LoginPage from "./login";

const mockAuth: IAuthContext = {
  user: null,
  loading: false,
  isAuthenticated: false,
  isReady: true,
  login: async () => {},
  loginAsDemo: async () => {},
  register: async () => {},
  googleLogin: async () => {},
  logout: async () => {},
};

function Harness({ showLogin }: { showLogin: boolean }) {
  return (
    <LanguageProvider>
      <AuthContext.Provider value={mockAuth}>
        <GoogleOAuthProvider clientId="test-client-id">
          <MemoryRouter>
            {showLogin ? <LoginPage /> : <span data-testid="empty" />}
          </MemoryRouter>
        </GoogleOAuthProvider>
      </AuthContext.Provider>
    </LanguageProvider>
  );
}

function renderLogin() {
  return render(<Harness showLogin />);
}

describe("LoginPage language", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("forces Thai copy even when the stored language is English", () => {
    localStorage.setItem("app-language", "en");
    renderLogin();
    expect(
      screen.getByText("การทำงานที่สงบ สำหรับทีมร้านอาหารที่ยุ่ง"),
    ).toBeInTheDocument();
  });

  it("restores the previous language on unmount", () => {
    localStorage.setItem("app-language", "en");
    const { rerender } = renderLogin();
    expect(localStorage.getItem("app-language")).toBe("th");
    // Unmount only the page (provider stays mounted, like the real app
    // where LanguageProvider sits above the router).
    rerender(<Harness showLogin={false} />);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
    expect(localStorage.getItem("app-language")).toBe("en");
  });
});
