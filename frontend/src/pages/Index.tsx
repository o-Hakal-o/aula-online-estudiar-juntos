import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CourseCard, { CourseProps } from "@/components/CourseCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { GraduationCap } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/types/carousel.types";

// Mock course data (moved outside component to avoid hook dependency warnings)
// TODO: Reemplazar con llamada al backend cuando esté disponible
const mockCourses: CourseProps[] = [
  {
    id: 1,
    title: "Fundamentos de Enfermería",
    description:
      "Aprende los conceptos básicos y habilidades fundamentales necesarias para comenzar una carrera exitosa en enfermería.",
    instructor: "Dra. Ana Martínez",
    level: "Principiante",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Fundamentos",
  },
  {
    id: 2,
    title: "Farmacología para Enfermería",
    description:
      "Domina los principios de la administración de medicamentos, cálculos de dosis y conocimientos farmacológicos esenciales para enfermeros.",
    instructor: "Dr. Carlos Sánchez",
    level: "Intermedio",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    category: "Farmacología",
  },
  {
    id: 3,
    title: "Cuidados Intensivos",
    description:
      "Desarrolla competencias avanzadas para atender a pacientes en estado crítico y manejar equipos especializados en UCI.",
    instructor: "Dra. Lucía González",
    level: "Avanzado",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    category: "Especialización",
  },
  {
    id: 4,
    title: "Enfermería Pediátrica",
    description:
      "Especialízate en el cuidado de pacientes infantiles y adolescentes con técnicas adaptadas a sus necesidades específicas.",
    instructor: "Dr. David Torres",
    level: "Intermedio",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    category: "Especialización",
  },
  {
    id: 5,
    title: "Comunicación con Pacientes",
    description:
      "Mejora tus habilidades de comunicación terapéutica para crear relaciones de confianza con pacientes y familiares.",
    instructor: "Dra. Elena Ruiz",
    level: "Principiante",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    category: "Habilidades Blandas",
  },
];

// categories removed: we always show all courses in the carousel now

const Index = () => {
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const [api, setApi] = useState<CarouselApi>(null);
  const [current, setCurrent] = useState(0);

  const autoplayOptions = {
    delay: 4000,
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
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  // Mostramos siempre todos los cursos en el carousel (sin filtrado por categoría)
  useEffect(() => {
    setFilteredCourses(mockCourses);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HeroSection />

        {/* Cursos */}
        <section id="courses" className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros Cursos de Enfermería
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra selección de cursos especializados diseñados para
              profesionales y estudiantes de enfermería que buscan mejorar sus competencias
            </p>
          </div>

          {/* Selección de categorías eliminada - el carousel muestra todos los cursos */}

          <Carousel
            className="w-full max-w-3xl mx-auto mb-12"
            setApi={setApi}
            plugins={[Autoplay(autoplayOptions)]}>
            <CarouselContent>
              {filteredCourses.map((course) => (
                <CarouselItem key={course.id} className="basis-full">
                  <div className="p-2">
                    <CourseCard {...course} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-4 mt-6">
              <CarouselPrevious className="relative inline-flex -left-0 h-9 w-9" />
              <div className="flex items-center gap-1">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  {current + 1} de {filteredCourses.length} cursos
                </span>
              </div>
              <CarouselNext className="relative inline-flex -right-0 h-9 w-9" />
            </div>
          </Carousel>

          <div className="text-center mt-6">
            <Button size="lg" variant="outline">
              Ver Todos los Cursos
            </Button>
          </div>
        </section>

        {/* Sección 'Especialización en Enfermería' eliminada según solicitud */}

        {/* Features */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Por qué elegir EnfermeríaOnline?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Forma parte de la próxima generación de profesionales de la
                salud con nuestra metodología innovadora y contenido de alta calidad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Contenido Clínico Actualizado
                </h3>
                <p className="text-muted-foreground">
                  Accede a materiales didácticos de alta calidad creados por
                  profesionales sanitarios en activo.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Práctica Simulada</h3>
                <p className="text-muted-foreground">
                  Practica procedimientos clínicos con casos simulados
                  interactivos que refuerzan el aprendizaje teórico.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Mentorías con Especialistas
                </h3>
                <p className="text-muted-foreground">
                  Conecta con profesionales de enfermería experimentados que te
                  guiarán durante tu formación.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
