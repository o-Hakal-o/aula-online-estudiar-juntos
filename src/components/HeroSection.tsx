
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-primary">Estudia</span> cuando y donde 
              <span className="text-accent"> quieras</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a miles de estudiantes y accede a cursos de alta calidad. Aprende a tu propio ritmo y mejora tus habilidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link to="#courses">Ver Cursos</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#login">Iniciar Sesión</Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 shadow-xl animate-float">
              <div className="bg-white rounded-lg shadow-lg p-5">
                <div className="w-full h-40 bg-muted rounded-md mb-4"></div>
                <div className="h-6 bg-muted rounded-md w-2/3 mb-3"></div>
                <div className="h-4 bg-muted rounded-md w-full mb-3"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-8 bg-primary rounded-md w-1/3"></div>
                  <div className="h-8 bg-accent rounded-md w-1/4"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-5 w-2/3">
                <div className="h-4 bg-muted rounded-md w-full mb-3"></div>
                <div className="h-4 bg-muted rounded-md w-4/5"></div>
                <div className="flex justify-end mt-3">
                  <div className="h-6 bg-secondary rounded-md w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
