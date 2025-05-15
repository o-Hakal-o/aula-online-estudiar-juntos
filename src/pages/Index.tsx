
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CourseCard, { CourseProps } from "@/components/CourseCard";
import LoginForm from "@/components/LoginForm";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  // Mock course data
  const mockCourses: CourseProps[] = [
    {
      id: 1,
      title: "Desarrollo Web con React",
      description: "Aprende a desarrollar aplicaciones web modernas con React.js, la biblioteca más popular para crear interfaces de usuario.",
      instructor: "Ana Martínez",
      level: "Intermedio",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      category: "Desarrollo Web"
    },
    {
      id: 2,
      title: "Diseño UX/UI Avanzado",
      description: "Domina el diseño de experiencias de usuario e interfaces modernas para crear productos digitales que destacan en el mercado.",
      instructor: "Carlos Sánchez",
      level: "Avanzado",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      category: "Diseño"
    },
    {
      id: 3,
      title: "Introducción a Python",
      description: "Comienza tu camino en la programación con Python, uno de los lenguajes más versátiles y fáciles de aprender.",
      instructor: "Lucía González",
      level: "Principiante",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      category: "Programación"
    },
    {
      id: 4,
      title: "Marketing Digital Efectivo",
      description: "Estrategias y tácticas comprobadas para impulsar tu negocio en línea y aumentar tus conversiones con marketing digital.",
      instructor: "David Torres",
      level: "Intermedio",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      category: "Marketing"
    },
    {
      id: 5,
      title: "Inglés para Negocios",
      description: "Mejora tus habilidades de comunicación en inglés para entornos empresariales y profesionales internacionales.",
      instructor: "Elena Ruiz",
      level: "Intermedio",
      price: 44.99,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      category: "Idiomas"
    },
    {
      id: 6,
      title: "Introducción a la Inteligencia Artificial",
      description: "Descubre los fundamentos de la IA y cómo está transformando diferentes industrias en la actualidad.",
      instructor: "Roberto Méndez",
      level: "Principiante",
      price: 0,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      category: "Tecnología"
    },
  ];

  const categories = ["Todos", "Desarrollo Web", "Diseño", "Programación", "Marketing", "Idiomas", "Tecnología"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);

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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Cursos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra selección de cursos para estudiantes de todos los niveles
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

          <div className="course-grid">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">Ver Todos los Cursos</Button>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué estudiar con nosotros?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Aprende de la manera más efectiva con nuestra metodología única
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
                <h3 className="text-xl font-bold mb-2">Contenido Premium</h3>
                <p className="text-muted-foreground">
                  Accede a materiales didácticos de alta calidad creados por expertos de la industria.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">A tu ritmo</h3>
                <p className="text-muted-foreground">
                  Estudia cuando quieras y donde quieras, adaptando el aprendizaje a tu horario.
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
                <h3 className="text-xl font-bold mb-2">Comunidad Activa</h3>
                <p className="text-muted-foreground">
                  Conecta con otros estudiantes y profesores para enriquecer tu experiencia de aprendizaje.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section id="login" className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¡Empieza a Aprender Hoy!</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Crea una cuenta o inicia sesión para acceder a todos los cursos
            </p>
          </div>

          <LoginForm />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
