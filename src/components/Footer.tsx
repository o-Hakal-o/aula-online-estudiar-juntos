
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">AulaOnline</h3>
            <p className="text-muted-foreground">
              Plataforma educativa para estudiantes que quieren aprender a su propio ritmo.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="#courses" className="text-muted-foreground hover:text-primary transition-colors">Cursos</Link></li>
              <li><Link to="#about" className="text-muted-foreground hover:text-primary transition-colors">Nosotros</Link></li>
              <li><Link to="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Desarrollo Web</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Diseño Gráfico</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Marketing Digital</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Idiomas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Email: info@aulaonline.com</li>
              <li className="text-muted-foreground">Teléfono: +34 123 456 789</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">FB</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">TW</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">IG</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">YT</a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} AulaOnline. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
