import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Debe ser un email válido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Simulación de envío de email
      // TODO: Conectar con endpoint del backend cuando esté disponible
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);
      toast({
        title: "Email enviado",
        description:
          "Si el email existe, recibirás instrucciones para recuperar tu contraseña.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el email. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio de sesión
          </Link>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
              <CardDescription>
                {emailSent
                  ? "Revisa tu bandeja de entrada"
                  : "Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailSent ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hemos enviado un email a{" "}
                    <strong>{form.getValues("email")}</strong> con instrucciones
                    para recuperar tu contraseña.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Si no recibes el email en unos minutos, revisa tu carpeta de
                    spam.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      setEmailSent(false);
                      form.reset();
                    }}
                  >
                    Enviar otro email
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="tu@email.com"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Enviando..." : "Enviar Instrucciones"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
