import React from 'react';
import { ShieldAlert, Gamepad2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-icon">
          <Gamepad2 size={26} className="icon-gamepad" />
        </div>
        <div>
          <div className="navbar-title-row">
            <h1 className="navbar-title">Pixel Legends</h1>
            <span className="badge-hunter">AFK Hunter</span>
          </div>
          <p className="navbar-subtitle">
            Auditoria de actividad y deteccion de sesiones de juego
          </p>
        </div>
      </div>

      <div className="navbar-status">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Servicio activo</span>
        </div>
        <div className="status-pill">
          <ShieldAlert size={16} />
          <span>Filtro de inactividad</span>
        </div>
      </div>
    </header>
  );
};
