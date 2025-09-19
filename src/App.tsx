import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as HotToaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized";
import Dashboard from "@/pages/Dashboard";
import PRList from "@/pages/PRList";
import PRCreate from "@/pages/PRCreate";
import PRDetails from "@/pages/PRDetails";
import Approvals from "@/pages/Approvals";
import Accounting from "@/pages/Accounting";
import AdminUsers from "@/pages/AdminUsers";
import AdminSettings from "@/pages/AdminSettings";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Reports from "@/pages/Reports";
import UserProfile from "@/pages/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <HotToaster 
            position="top-right"
            toastOptions={{
              className: '',
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              },
              success: {
                style: {
                  background: 'hsl(142.1 76.2% 36.3%)',
                  color: 'hsl(0 0% 100%)', // Pure white for maximum contrast
                  border: '1px solid hsl(142.1 70.6% 45.3%)',
                  boxShadow: '0 4px 12px rgba(20, 184, 100, 0.2)',
                },
              },
              error: {
                style: {
                  background: 'hsl(var(--destructive))',
                  color: 'hsl(var(--destructive-foreground))',
                  border: '1px solid hsl(var(--destructive))',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)',
                },
              },
            }}
          />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes with layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="prs" element={<PRList />} />
              <Route path="prs/create" element={
                <ProtectedRoute requiredRoles={['USER']}>
                  <PRCreate />
                </ProtectedRoute>
              } />
              <Route path="prs/:id" element={<PRDetails />} />
              <Route path="prs/:id/edit" element={
                <ProtectedRoute requiredRoles={['USER']}>
                  <PRCreate />
                </ProtectedRoute>
              } />
              <Route path="approvals" element={
                <ProtectedRoute requiredRoles={['DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER']}>
                  <Approvals />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute requiredRoles={['DIRECT_MANAGER', 'FINAL_MANAGER', 'ADMIN']}>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="accounting" element={
                <ProtectedRoute requiredRoles={['ACCOUNTANT']}>
                  <Accounting />
                </ProtectedRoute>
              } />
              <Route path="admin/users" element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="admin/settings" element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              <Route path="profile" element={<UserProfile />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  </LanguageProvider>
);

export default App;
