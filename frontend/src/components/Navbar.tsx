import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Settings, GraduationCap } from "lucide-react";
import { env } from "@/config/env";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Cursos", href: "#courses" },
    { name: "Nosotros", href: "#about" },
    { name: "Contacto", href: "#contact" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    if (isMobile) setIsOpen(false);
  };

  const handleGoToAdmin = () => {
    const adminUrl = `${env.API_BASE_URL}/admin/`;
    window.open(adminUrl, "_blank");
    if (isMobile) setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className="text-foreground hover:text-primary transition-colors"
          onClick={() => isMobile && setIsOpen(false)}
        >
          {link.name}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">
            EnfermeríaOnline
          </span>
        </Link>

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks />
                {isAuthenticated ? (
                  <>
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/perfil" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </Button>
                    {(user?.is_superuser || user?.is_staff) && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoToAdmin}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Panel Admin
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <NavLinks />
            </div>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user?.first_name || user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  {(user?.is_superuser || user?.is_staff) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleGoToAdmin}>
                        <Settings className="mr-2 h-4 w-4" />
                        Panel de Administración
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
