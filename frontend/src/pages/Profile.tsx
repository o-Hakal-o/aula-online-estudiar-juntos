import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { env } from "@/config/env";
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  LogOut,
  Settings,
  FileText,
} from "lucide-react";

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si no está autenticado
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const isProfessor = user.role === "PROFESSOR";
  const isAdmin = user.is_superuser || user.is_staff;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoToAdmin = () => {
    const adminUrl = `${env.API_BASE_URL}/admin/`;
    window.open(adminUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground">
              Gestiona tu información personal y preferencias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Información del usuario */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.email}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Rol</span>
                    </div>
                    <Badge
                      variant={isProfessor ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {isProfessor ? (
                        <>
                          <GraduationCap className="mr-1 h-3 w-3" />
                          Profesor
                        </>
                      ) : (
                        <>
                          <User className="mr-1 h-3 w-3" />
                          Estudiante
                        </>
                      )}
                    </Badge>
                  </div>
                  {user.first_name && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Nombre</span>
                      <span className="text-muted-foreground">
                        {user.first_name}
                      </span>
                    </div>
                  )}
                  {user.last_name && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Apellido</span>
                      <span className="text-muted-foreground">
                        {user.last_name}
                      </span>
                    </div>
                  )}
                  {user.username && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Usuario</span>
                      <span className="text-muted-foreground">
                        {user.username}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
                <CardDescription>Gestiona tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleGoToAdmin}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Panel de Administración
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Cursos
                </Button>
                <Separator />
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas (solo para profesores) */}
          {isProfessor && (
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
                <CardDescription>
                  Resumen de tu actividad como profesor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">
                      Archivos Subidos
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Cursos</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Estudiantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

