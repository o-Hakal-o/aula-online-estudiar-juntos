
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Users, Award, BookOpen, CheckCircle, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CuidadosIntensivos = () => {
  const courseModules = [
    {
      title: "Fundamentos de Cuidados Intensivos",
      duration: "2 horas",
      lessons: 8,
      completed: true
    },
    {
      title: "Monitorización Avanzada",
      duration: "3 horas",
      lessons: 12,
      completed: true
    },
    {
      title: "Ventilación Mecánica",
      duration: "4 horas",
      lessons: 15,
      completed: false
    },
    {
      title: "Farmacología en UCI",
      duration: "2.5 horas",
      lessons: 10,
      completed: false
    },
    {
      title: "Procedimientos Invasivos",
      duration: "3.5 horas",
      lessons: 14,
      completed: false
    },
    {
      title: "Casos Clínicos Prácticos",
      duration: "2 horas",
      lessons: 6,
      completed: false
    }
  ];

  const skills = [
    "Manejo de ventiladores mecánicos",
    "Interpretación de parámetros hemodinámicos",
    "Administración de drogas vasoactivas",
    "Técnicas de monitorización invasiva",
    "Protocolos de sedación y analgesia",
    "Manejo de dispositivos de asistencia circulatoria"
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Especialización
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                Avanzado
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Cuidados Intensivos
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Desarrolla competencias avanzadas para atender a pacientes en estado crítico y manejar equipos especializados en UCI. 
              Aprende las técnicas más actuales en cuidados intensivos con casos reales y simulaciones prácticas.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                1,247 estudiantes
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                17 horas de contenido
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certificación incluida
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <PlayCircle className="h-12 w-12 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">$69.99</div>
                <CardDescription>Acceso completo de por vida</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  Inscribirse Ahora
                </Button>
                <Button variant="outline" className="w-full">
                  Vista Previa Gratuita
                </Button>
                
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progreso</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <Tabs defaultValue="contenido" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="competencias">Competencias</TabsTrigger>
            <TabsTrigger value="certificacion">Certificación</TabsTrigger>
          </TabsList>

          <TabsContent value="contenido" className="mt-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Módulos del Curso</h3>
              {courseModules.map((module, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          module.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {module.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>
                            {module.lessons} lecciones • {module.duration}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant={module.completed ? "default" : "outline"} size="sm">
                        {module.completed ? "Revisar" : "Comenzar"}
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructor" className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-purple-600">LG</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Dra. Lucía González</CardTitle>
                    <CardDescription>Especialista en Medicina Intensiva</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  La Dra. Lucía González es médica especialista en Medicina Intensiva con más de 15 años de experiencia 
                  en unidades de cuidados intensivos. Ha trabajado en hospitales de referencia y actualmente dirige 
                  el departamento de UCI del Hospital General Metropolitano.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <div className="text-sm text-gray-600">Años de experiencia</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3,500+</div>
                    <div className="text-sm text-gray-600">Estudiantes formados</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">4.9/5</div>
                    <div className="text-sm text-gray-600">Calificación promedio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competencias" className="mt-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Competencias que desarrollarás</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certificacion" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  Certificación Profesional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Al completar exitosamente este curso, recibirás una certificación profesional en Cuidados Intensivos 
                  reconocida por instituciones de salud líderes en el sector.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">La certificación incluye:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Certificado digital verificable</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Reconocimiento por 40 horas académicas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Válido para desarrollo profesional continuo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Acceso a red profesional de egresados</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CuidadosIntensivos;
