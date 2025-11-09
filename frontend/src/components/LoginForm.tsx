import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Tabs removed — solo se muestra el formulario de login
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // try to get a useful error message from the response
        let errMsg = "Error en la solicitud";
        try {
          const errData = await response.json();
          if (errData?.detail) errMsg = errData.detail;
          else if (errData?.message) errMsg = errData.message;
        } catch (e) {
          /* ignore json parse error */
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      // Si el backend devuelve un token (o access/refresh), guárdalo
      if (data.token) {
        localStorage.setItem("token", data.token);
      } else if (data.access) {
        // JWT style (access/refresh)
        localStorage.setItem("accessToken", data.access);
        if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
      }
      if (data.user) {
        try {
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (e) {
          // ignore storage errors
        }
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido${
          data.user?.first_name ? ", " + data.user.first_name : ""
        }`,
      });

      // Redirigir al inicio u otra ruta proteGida
      navigate("/");
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Verifica tus credenciales e intenta nuevamente.";
      toast({
        title: "Error en el inicio de sesión",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Acceso Estudiantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
