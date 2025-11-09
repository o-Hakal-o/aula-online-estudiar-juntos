// Página de Cuidados Intensivos eliminada: ahora redirigimos al inicio si se accede.
import { Navigate } from "react-router-dom";

const CuidadosIntensivos = () => {
  // Redirigir a la página principal — la vista detallada fue eliminada según solicitud
  return <Navigate to="/" replace />;
};

export default CuidadosIntensivos;
