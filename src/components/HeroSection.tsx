
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Hospital } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";

const HeroSection = () => {
  const nursingImages = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=1200",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200"
  ];

  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  const autoplayOptions = {
    delay: 3500,
    rootNode: (emblaRoot: HTMLElement) => emblaRoot,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  return (
    <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-primary">Formación</span> en enfermería 
              <span className="text-accent"> de calidad</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a miles de profesionales de enfermería y accede a cursos especializados. Aprende a tu propio ritmo y mejora tus competencias clínicas.
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
            <Carousel 
              className="w-full max-w-lg mx-auto"
              setApi={setApi}
              plugins={[
                Autoplay(autoplayOptions)
              ]}
            >
              <CarouselContent>
                {nursingImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="overflow-hidden rounded-xl border border-muted shadow-md">
                        <AspectRatio ratio={4/3}>
                          <img 
                            src={image} 
                            alt={`Imagen de enfermería ${index + 1}`} 
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                          />
                        </AspectRatio>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-4 mt-4">
                <CarouselPrevious className="relative inline-flex -left-0 h-9 w-9" />
                <div className="flex items-center gap-1">
                  <Hospital className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    {current + 1} de {nursingImages.length}
                  </span>
                </div>
                <CarouselNext className="relative inline-flex -right-0 h-9 w-9" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
