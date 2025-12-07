import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Configuración de React Query con mejores prácticas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reintentar 1 vez en caso de error
      refetchOnWindowFocus: false, // No refetch automático al cambiar de ventana
      staleTime: 5 * 60 * 1000, // Los datos son "frescos" por 5 minutos
      gcTime: 10 * 60 * 1000, // Mantener en cache por 10 minutos (antes cacheTime)
    },
    mutations: {
      retry: 0, // No reintentar mutaciones
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contraseña" element={<ForgotPassword />} />
            <Route
              path="/curso/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
