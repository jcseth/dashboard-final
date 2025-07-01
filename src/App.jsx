import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './Dashboard';
import EmpresarialDashboard from './EmpresarialDashboard';
import Configuracion from './Configuracion';
import logoIzquierdo from './assets/logo_izquierda.png';
import logoDerecho from './assets/logo_derecha.png';

function App() {
  const navLinkStyles = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#0ea5e9' : '#374151', // Azul (activo) y gris oscuro (inactivo)
  });

  return (
    <BrowserRouter>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="relative max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <img
            src={logoIzquierdo}
            alt="Logo Principal"
            className="h-32 w-auto"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

            {/* --- LÍNEA MODIFICADA AL TAMAÑO INTERMEDIO --- */}
            <div className="space-x-12 text-xl">
              <NavLink to="/" style={navLinkStyles} className="hover:text-sky-600 transition-colors">
                Masivo
              </NavLink>
              <NavLink to="/empresarial" style={navLinkStyles} className="hover:text-sky-600 transition-colors">
                Empresarial
              </NavLink>
              <NavLink to="/configuracion" style={navLinkStyles} className="hover:text-sky-600 transition-colors">
                Configuración
              </NavLink>
            </div>
            {/* --- FIN DE LÍNEA MODIFICADA --- */}

          </div>
          <img
            src={logoDerecho}
            alt="Logo Secundario"
            className="h-20 w-auto"
          />
        </nav>
      </header>
      <main className="bg-slate-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/empresarial" element={<EmpresarialDashboard />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
