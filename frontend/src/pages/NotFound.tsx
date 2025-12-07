import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! Página no encontrada
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          La ruta <code className="bg-background px-2 py-1 rounded">{location.pathname}</code> no existe
        </p>
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
