import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CourseCard, { CourseProps } from "@/components/CourseCard";
import LoginForm from "@/components/LoginForm";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { GraduationCap, Heart, Users, Award, Clock } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";

const Index = () => {
  // Mock course data
  const mockCourses: CourseProps[] = [
    {
      id: 1,
      title: "Fundamentos de Enfermería",
      description: "Aprende los conceptos básicos y habilidades fundamentales necesarias para comenzar una carrera exitosa en enfermería.",
      instructor: "Dra. Ana Martínez",
      level: "Principiante",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      category: "Fundamentos"
    },
    {
      id: 2,
      title: "Farmacología para Enfermería",
      description: "Domina los principios de la administración de medicamentos, cálculos de dosis y conocimientos farmacológicos esenciales para enfermeros.",
      instructor: "Dr. Carlos Sánchez",
      level: "Intermedio",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      category: "Farmacología"
    },
    {
      id: 3,
      title: "Cuidados Intensivos",
      description: "Desarrolla competencias avanzadas para atender a pacientes en estado crítico y manejar equipos especializados en UCI.",
      instructor: "Dra. Lucía González",
      level: "Avanzado",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      category: "Especialización"
    },
    {
      id: 4,
      title: "Enfermería Pediátrica",
      description: "Especialízate en el cuidado de pacientes infantiles y adolescentes con técnicas adaptadas a sus necesidades específicas.",
      instructor: "Dr. David Torres",
      level: "Intermedio",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      category: "Especialización"
    },
    {
      id: 5,
      title: "Comunicación con Pacientes",
      description: "Mejora tus habilidades de comunicación terapéutica para crear relaciones de confianza con pacientes y familiares.",
      instructor: "Dra. Elena Ruiz",
      level: "Principiante",
      price: 44.99,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      category: "Habilidades Blandas"
    },
    
  ];

  const categories = ["Todos", "Fundamentos", "Farmacología", "Especialización", "Habilidades Blandas"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const [api, setApi] = useState<any>(null);
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
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (selectedCategory === "Todos") {
      setFilteredCourses(mockCourses);
    } else {
      setFilteredCourses(mockCourses.filter(course => course.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Cursos */}
        <section id="courses" className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Cursos de Enfermería</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra selección de cursos especializados para profesionales y estudiantes de enfermería
            </p>
          </div>

          <Tabs defaultValue="Todos" className="w-full mb-8">
            <TabsList className="flex flex-wrap w-full mb-8 justify-center">
              {categories.map(category => (
                <TabsTrigger 
                  key={category}
                  value={category} 
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Carousel 
            className="w-full max-w-3xl mx-auto mb-12"
            setApi={setApi}
            plugins={[
              Autoplay(autoplayOptions)
            ]}
          >
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
            <Button size="lg" variant="outline">Ver Todos los Cursos</Button>
          </div>
        </section>

        {/* Nueva Sección Especializada de Enfermería */}
        <section id="nursing-specialty" className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Heart className="h-4 w-4" />
                Especialización en Enfermería
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Tu Futuro en <span className="text-primary">Enfermería</span> Comienza Aquí
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Descubre nuestra formación integral en enfermería, diseñada por profesionales expertos 
                para prepararte en todas las áreas de la atención sanitaria moderna.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-6">¿Por qué elegir nuestro programa de enfermería?</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Formación Práctica Integral</h4>
                      <p className="text-muted-foreground">
                        Combina teoría y práctica con simulaciones clínicas reales y casos de estudio actualizados.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Certificación Profesional</h4>
                      <p className="text-muted-foreground">
                        Obtén certificaciones reconocidas por instituciones de salud líderes en el sector.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Flexibilidad Total</h4>
                      <p className="text-muted-foreground">
                        Estudia a tu ritmo con acceso 24/7 a materiales, videos y recursos educativos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-xl border">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Programa Completo de Enfermería</h4>
                    <p className="text-muted-foreground">Desde fundamentos hasta especialización avanzada</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-muted">
                      <span className="font-medium">Duración del programa</span>
                      <span className="text-primary font-semibold">12-18 meses</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-muted">
                      <span className="font-medium">Modalidad</span>
                      <span className="text-primary font-semibold">Online + Prácticas</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-muted">
                      <span className="font-medium">Certificación</span>
                      <span className="text-primary font-semibold">Oficial</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">Inserción laboral</span>
                      <span className="text-accent font-semibold">95%+</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Solicitar Información
                  </Button>
                </div>
              </div>
            </div>

            {/* Estadísticas de Enfermería */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-8">Impacto de Nuestros Graduados</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
                  <p className="text-muted-foreground">Enfermeros Graduados</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">95%</div>
                  <p className="text-muted-foreground">Tasa de Empleabilidad</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">150+</div>
                  <p className="text-muted-foreground">Hospitales Aliados</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                  <p className="text-muted-foreground">Satisfacción Estudiantil</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué estudiar enfermería con nosotros?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Forma parte de la próxima generación de profesionales de la salud con nuestra metodología única
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Contenido Clínico Actualizado</h3>
                <p className="text-muted-foreground">
                  Accede a materiales didácticos de alta calidad creados por profesionales sanitarios en activo.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Práctica Simulada</h3>
                <p className="text-muted-foreground">
                  Practica procedimientos clínicos con casos simulados interactivos que refuerzan el aprendizaje teórico.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Mentorías con Especialistas</h3>
                <p className="text-muted-foreground">
                  Conecta con profesionales de enfermería experimentados que te guiarán durante tu formación.
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
