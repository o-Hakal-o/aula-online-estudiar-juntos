
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
            <p className="text-muted-foreground">
              Ingresa con tu cuenta para acceder a los cursos y recursos de EnfermeríaOnline
            </p>
          </div>
          <LoginForm />
          <div className="text-center mt-6">
            <Link to="/" className="text-primary hover:underline">
              Volver a la página principal
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;