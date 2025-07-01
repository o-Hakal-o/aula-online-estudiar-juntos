
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Users, Clock, Award, BookOpen, Heart, Brain, Stethoscope, UserCheck, Activity, Shield, Microscope } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import CourseCard, { CourseProps } from "@/components/CourseCard";

const Index = () => {
  const courses: CourseProps[] = [
    {
      id: 1,
      title: "Fundamentos de Enfermería",
      description: "Aprende los conceptos básicos y fundamentales de la práctica de enfermería, incluyendo anatomía, fisiología y técnicas básicas de cuidado.",
      instructor: "Dra. María González",
      level: "Principiante",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
      category: "Fundamentos"
    },
    {
      id: 2,
      title: "Cuidados Intensivos",
      description: "Especialízate en el cuidado de pacientes críticos y el manejo de equipos especializados en unidades de cuidados intensivos.",
      instructor: "Dr. Carlos Rodríguez",
      level: "Avanzado",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f",
      category: "Especialización"
    },
    {
      id: 3,
      title: "Farmacología para Enfermeros",
      description: "Domina el conocimiento de medicamentos, sus efectos, interacciones y administración segura en el cuidado del paciente.",
      instructor: "Dra. Ana Martínez",
      level: "Intermedio",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
      category: "Farmacología"
    },
    {
      id: 4,
      title: "Pediatría y Neonatología",
      description: "Desarrolla habilidades especializadas para el cuidado de recién nacidos, bebés y niños en diferentes etapas de desarrollo.",
      instructor: "Dra. Laura Fernández",
      level: "Intermedio",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f",
      category: "Especialización"
    },
    {
      id: 5,
      title: "Geriatría y Gerontología",
      description: "Especialízate en el cuidado integral de adultos mayores, comprendiendo sus necesidades específicas y cambios asociados al envejecimiento.",
      instructor: "Dr. Roberto Silva",
      level: "Intermedio",
      price: 74.99,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
      category: "Especialización"
    },
    {
      id: 6,
      title: "Salud Mental y Psiquiatría",
      description: "Aprende a brindar cuidados especializados en salud mental, manejo de crisis y apoyo psicológico a pacientes.",
      instructor: "Dra. Patricia López",
      level: "Avanzado",
      price: 84.99,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      category: "Especialización"
    }
  ];

  const features = [
    {
      icon: <Heart className="h-12 w-12 text-red-500" />,
      title: "Cuidado Compasivo",
      description: "Aprende a brindar atención centrada en el paciente con empatía y profesionalismo."
    },
    {
      icon: <Brain className="h-12 w-12 text-purple-500" />,
      title: "Conocimiento Avanzado",
      description: "Domina los últimos avances en ciencias de la salud y técnicas de enfermería."
    },
    {
      icon: <Stethoscope className="h-12 w-12 text-blue-500" />,
      title: "Práctica Clínica",
      description: "Desarrolla habilidades prácticas a través de simulaciones y casos reales."
    },
    {
      icon: <UserCheck className="h-12 w-12 text-green-500" />,
      title: "Certificación Profesional",
      description: "Obtén certificaciones reconocidas que impulsen tu carrera profesional."
    },
    {
      icon: <Activity className="h-12 w-12 text-orange-500" />,
      title: "Monitoreo Vital",
      description: "Aprende técnicas avanzadas de monitoreo y evaluación de signos vitales."
    },
    {
      icon: <Shield className="h-12 w-12 text-indigo-500" />,
      title: "Seguridad del Paciente",
      description: "Domina protocolos de seguridad y prevención de riesgos en el cuidado."
    }
  ];

  const testimonials = [
    {
      name: "María Elena Rodríguez",
      role: "Enfermera Especialista en UCI",
      content: "Los cursos de EnfermeríaPro me han permitido desarrollar habilidades que nunca pensé que podría alcanzar. La calidad de la educación es excepcional.",
      rating: 5
    },
    {
      name: "Carlos Alberto Mendoza",
      role: "Supervisor de Enfermería",
      content: "Como supervisor, he visto la diferencia que hace la formación continua. Estos cursos han elevado el nivel de todo mi equipo.",
      rating: 5
    },
    {
      name: "Ana Patricia Herrera",
      role: "Enfermera Pediátrica",
      content: "La especialización en pediatría que tomé aquí cambió completamente mi perspectiva profesional. Altamente recomendado.",
      rating: 5
    }
  ];

  const stats = [
    { number: "15,000+", label: "Estudiantes Graduados" },
    { number: "98%", label: "Tasa de Aprobación" },
    { number: "500+", label: "Horas de Contenido" },
    { number: "24/7", label: "Soporte Disponible" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <HeroSection />
      
      {/* Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Cursos Especializados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desarrolla tu carrera profesional con nuestros cursos diseñados por expertos en enfermería
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              ¿Por qué elegir EnfermeríaPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma está diseñada específicamente para profesionales de enfermería que buscan excelencia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Nuestros Resultados Hablan por Sí Solos
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Miles de profesionales han confiado en nosotros para su desarrollo profesional
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Lo que Dicen Nuestros Estudiantes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Historias reales de profesionales que han transformado sus carreras con nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Comienza Tu Transformación Profesional Hoy
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Únete a miles de profesionales que ya han elevado su carrera con nuestros cursos especializados
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Ver Todos los Cursos
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600">
              Solicitar Información
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
