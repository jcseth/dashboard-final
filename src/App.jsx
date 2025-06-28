// Contenido para src/App.jsx
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './Dashboard';
import Configuracion from './Configuracion';
import logoIzquierdo from './assets/logo_izquierda.png';
import logoDerecho from './assets/logo_derecha.png';

function App() {
  const navLinkStyles = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#67e8f9' : 'white', // Cian para el enlace activo
  });

  return (
    <BrowserRouter>
      {/* Barra de Navegación con logos */}
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <img src={logoIzquierdo} alt="Logo Principal" className="h-10" />
          <div className="space-x-8 text-lg">
            <NavLink to="/" style={navLinkStyles} className="hover:text-slate-300 transition-colors">
              Dashboard
            </NavLink>
            <NavLink to="/configuracion" style={navLinkStyles} className="hover:text-slate-300 transition-colors">
              Configuración
            </NavLink>
          </div>
          <img src={logoDerecho} alt="Logo Secundario" className="h-10" />
        </nav>
      </header>

      {/* Área donde se renderizarán las páginas */}
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;