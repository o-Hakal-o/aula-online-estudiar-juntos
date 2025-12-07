import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { filesService } from "@/services/files.service";
import type { ProfessorFile } from "@/types/api.types";
import {
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  BookOpen,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

// Mock data para el curso (cuando el backend tenga este endpoint, se reemplazará)
const getCourseById = (id: string) => {
  const courses = [
    {
      id: 1,
      title: "Fundamentos de Enfermería",
      description:
        "Aprende los conceptos básicos y habilidades fundamentales necesarias para comenzar una carrera exitosa en enfermería. Este curso cubre temas esenciales como anatomía básica, fisiología, terminología médica y principios fundamentales de cuidado al paciente.",
      instructor: "Dra. Ana Martínez",
      level: "Principiante",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      category: "Fundamentos",
      duration: "40 horas",
      students: 1250,
    },
    {
      id: 2,
      title: "Farmacología para Enfermería",
      description:
        "Domina los principios de la administración de medicamentos, cálculos de dosis y conocimientos farmacológicos esenciales para enfermeros. Incluye casos prácticos y simulaciones.",
      instructor: "Dr. Carlos Sánchez",
      level: "Intermedio",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      category: "Farmacología",
      duration: "50 horas",
      students: 980,
    },
    {
      id: 3,
      title: "Cuidados Intensivos",
      description:
        "Desarrolla competencias avanzadas para atender a pacientes en estado crítico y manejar equipos especializados en UCI. Incluye prácticas con simuladores de alta fidelidad.",
      instructor: "Dra. Lucía González",
      level: "Avanzado",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      category: "Especialización",
      duration: "60 horas",
      students: 650,
    },
  ];
  return courses.find((c) => c.id === parseInt(id));
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const course = id ? getCourseById(id) : null;

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para ver los detalles del curso.",
      });
      navigate("/login", { state: { from: `/curso/${id}` } });
    }
  }, [isAuthenticated, navigate, id, toast]);

  // Obtener archivos del curso
  const {
    data: filesData,
    isLoading: isLoadingFiles,
    error: filesError,
  } = useQuery({
    queryKey: ["courseFiles", id],
    queryFn: () => filesService.getFiles(),
    enabled: isAuthenticated,
  });

  // Mutación para subir archivo
  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!selectedFile) throw new Error("No se seleccionó ningún archivo");
      return filesService.uploadFile(selectedFile, fileTitle || undefined);
    },
    onSuccess: () => {
      toast({
        title: "Archivo subido",
        description: "El archivo se ha subido correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["courseFiles"] });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setFileTitle("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo subir el archivo.",
        variant: "destructive",
      });
    },
  });

  // Mutación para eliminar archivo
  const deleteMutation = useMutation({
    mutationFn: (fileId: number) => filesService.deleteFile(fileId),
    onSuccess: () => {
      toast({
        title: "Archivo eliminado",
        description: "El archivo se ha eliminado correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["courseFiles"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el archivo.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!fileTitle) {
        setFileTitle(file.name);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo.",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate();
  };

  const handleDownload = (file: ProfessorFile) => {
    const url = filesService.getFileUrl(file.file);
    window.open(url, "_blank");
  };

  const isProfessor = user?.role === "PROFESSOR";

  if (!isAuthenticated) {
    return null; // El useEffect redirigirá
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
            <Button asChild>
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a los cursos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del curso */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={`${course.image}?q=80&w=1200`}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Instructor</p>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duración</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nivel</p>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Estudiantes</p>
                      <p className="font-medium">{course.students}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Archivos del curso */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Material del Curso</CardTitle>
                    <CardDescription>
                      {isProfessor
                        ? "Gestiona los archivos del curso"
                        : "Descarga los materiales disponibles"}
                    </CardDescription>
                  </div>
                  {isProfessor && (
                    <Dialog
                      open={isUploadDialogOpen}
                      onOpenChange={setIsUploadDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Subir Archivo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Subir Archivo</DialogTitle>
                          <DialogDescription>
                            Selecciona un archivo para compartir con los estudiantes
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="file">Archivo</Label>
                            <Input
                              id="file"
                              type="file"
                              onChange={handleFileSelect}
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                            />
                            {selectedFile && (
                              <p className="text-sm text-muted-foreground">
                                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="title">Título (opcional)</Label>
                            <Input
                              id="title"
                              value={fileTitle}
                              onChange={(e) => setFileTitle(e.target.value)}
                              placeholder="Nombre del archivo"
                            />
                          </div>
                          <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploadMutation.isPending}
                            className="w-full"
                          >
                            {uploadMutation.isPending ? "Subiendo..." : "Subir Archivo"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingFiles ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Cargando archivos...</p>
                  </div>
                ) : filesError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">
                      Error al cargar los archivos. Intenta nuevamente.
                    </p>
                  </div>
                ) : filesData?.data && filesData.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filesData.data.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{file.title || "Sin título"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(file.uploaded_at), "dd MMM yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(file)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {isProfessor && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "¿Estás seguro de que deseas eliminar este archivo?"
                                      )
                                    ) {
                                      deleteMutation.mutate(file.id);
                                    }
                                  }}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {isProfessor
                        ? "Aún no hay archivos. Sube el primero para comenzar."
                        : "Aún no hay archivos disponibles para este curso."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Categoría</p>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Precio</p>
                  <p className="text-2xl font-bold">
                    {course.price === 0 ? "Gratis" : `$${course.price.toFixed(2)}`}
                  </p>
                </div>
                <Button className="w-full" size="lg">
                  Inscribirse al Curso
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;

