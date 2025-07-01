
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, Award, BookOpen, CheckCircle, PlayCircle, FileText, Video, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const CuidadosIntensivos = () => {
  const subjects = [
    {
      id: 1,
      title: "Anatomía y Fisiología Avanzada",
      description: "Comprende el funcionamiento detallado de los sistemas corporales en estado crítico",
      duration: "40 horas",
      modules: 8,
      level: "Avanzado",
      status: "available"
    },
    {
      id: 2,
      title: "Farmacología en Cuidados Críticos",
      description: "Medicamentos esenciales, dosis y protocolos en pacientes críticos",
      duration: "35 horas",
      modules: 7,
      level: "Avanzado",
      status: "available"
    },
    {
      id: 3,
      title: "Ventilación Mecánica",
      description: "Manejo completo de ventiladores y técnicas de soporte respiratorio",
      duration: "45 horas",
      modules: 9,
      level: "Experto",
      status: "available"
    },
    {
      id: 4,
      title: "Monitorización Hemodinámica",
      description: "Interpretación y manejo de parámetros cardiovasculares críticos",
      duration: "38 horas",
      modules: 8,
      level: "Avanzado",
      status: "available"
    },
    {
      id: 5,
      title: "Cuidados Neurológicos Intensivos",
      description: "Manejo de pacientes con lesiones cerebrales y trastornos neurológicos",
      duration: "42 horas",
      modules: 8,
      level: "Experto",
      status: "coming-soon"
    },
    {
      id: 6,
      title: "Procedimientos Invasivos",
      description: "Técnicas avanzadas de cateterización y procedimientos especializados",
      duration: "30 horas",
      modules: 6,
      level: "Experto",
      status: "available"
    },
    {
      id: 7,
      title: "Manejo de Emergencias",
      description: "Protocolos de reanimación y manejo de situaciones críticas",
      duration: "35 horas",
      modules: 7,
      level: "Avanzado",
      status: "available"
    },
    {
      id: 8,
      title: "Ética y Bioética en UCI",
      description: "Dilemas éticos y toma de decisiones en cuidados intensivos",
      duration: "25 horas",
      modules: 5,
      level: "Intermedio",
      status: "coming-soon"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Intermedio":
        return "bg-blue-100 text-blue-800";
      case "Avanzado":
        return "bg-purple-100 text-purple-800";
      case "Experto":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Especialización
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              Programa Completo
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Especialización en Cuidados Intensivos
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Programa integral de especialización para formar profesionales de enfermería expertos en el manejo 
            de pacientes críticos y equipos especializados de UCI.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              1,247 estudiantes
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              290 horas totales
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              8 asignaturas
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificación oficial
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Inscribirse al Programa Completo
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Información Detallada
            </Button>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
            Asignaturas del Programa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-all duration-300 relative">
                {subject.status === "coming-soon" && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Próximamente
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">{subject.id}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={getLevelColor(subject.level)}
                    >
                      {subject.level}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">{subject.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {subject.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {subject.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      {subject.modules} módulos
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={subject.status === "coming-soon" ? "outline" : "default"}
                    disabled={subject.status === "coming-soon"}
                  >
                    {subject.status === "coming-soon" ? "Próximamente" : "Ver Asignatura"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Program Benefits */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Beneficios del Programa
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Certificación Oficial</h4>
              <p className="text-sm text-gray-600">Reconocida por instituciones de salud</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Instructores Expertos</h4>
              <p className="text-sm text-gray-600">Profesionales con amplia experiencia</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PlayCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Casos Prácticos</h4>
              <p className="text-sm text-gray-600">Simulaciones y casos reales</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Horarios Flexibles</h4>
              <p className="text-sm text-gray-600">Estudia a tu propio ritmo</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            ¿Listo para Especializarte?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Únete a nuestro programa de especialización y conviértete en un experto en cuidados intensivos. 
            Transforma tu carrera profesional con la formación más completa del sector.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Inscribirse Ahora
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Solicitar Información
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuidadosIntensivos;
