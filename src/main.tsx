import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./root";
import DashboardLayout from "./components/DashboardLayout";
import Landing from "./routes/landing";
import Login from "./routes/login";
import Signup from "./routes/signup";
import Dashboard from "./routes/dashboard";
import AuthCallback from "./routes/auth-callback";
import SubscriptionsPage from "./routes/subscriptions";
import Pricing from "./routes/pricing";

import "./styles/app.css";

const queryClient = new QueryClient();

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-muted-foreground">Coming soon.</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes with top navbar */}
              <Route element={<RootLayout />}>
                <Route index element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="auth/callback" element={<AuthCallback />} />
                <Route path="pricing" element={<Pricing />} />
              </Route>

              {/* Dashboard routes with sidebar layout */}
              <Route element={<DashboardLayout />}>
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="subscriptions"
                  element={
                    <ProtectedRoute>
                      <SubscriptionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="insights"
                  element={
                    <ProtectedRoute>
                      <Placeholder title="Insights" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Placeholder title="Settings" />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
