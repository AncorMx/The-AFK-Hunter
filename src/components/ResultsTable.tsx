import React from 'react';
import type { PlayerReport, HuntAFKResult } from '../types/afk.types';
import { Users, Clock, Flame, ShieldAlert, Eye, CheckCircle2 } from 'lucide-react';

interface ResultsTableProps {
  reports: PlayerReport[];
  rawResult: HuntAFKResult;
  onSelectPlayer: (player: PlayerReport) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  reports,
  rawResult,
  onSelectPlayer,
}) => {
  const totalPlayers = reports.length;
  const totalSessions = reports.reduce((acc, r) => acc + r.sessions, 0);
  const longestGlobal = reports.reduce((max, r) => Math.max(max, r.longest), 0);

  return (
    <div className="card results-card">
      <div className="card-header">
        <div className="card-title">
          <CheckCircle2 size={18} className="text-success" />
          <span>Resultados huntAFK (Orden alfabetico)</span>
        </div>
      </div>

      <div className="card-body">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">
              <Users size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-value">{totalPlayers}</span>
              <span className="kpi-label">Jugadores identificados</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">
              <Clock size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-value">{totalSessions}</span>
              <span className="kpi-label">Sesiones totales</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">
              <Flame size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-value">{longestGlobal} min</span>
              <span className="kpi-label">Sesion mas larga global</span>
            </div>
          </div>
        </div>

        {totalPlayers === 0 ? (
          <div className="empty-state">
            <ShieldAlert size={36} className="text-secondary" />
            <p className="empty-state-title">No hay jugadores para mostrar</p>
            <p className="empty-state-subtitle">
              El registro esta vacio o no contiene eventos con formato valido.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="afk-table">
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th className="text-center">Sesiones</th>
                  <th className="text-center">Sesion mas larga</th>
                  <th>Diagnostico</th>
                  <th className="text-right">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  let badgeClass = 'badge-regular';
                  let badgeText = 'Actividad normal';

                  if (report.status === 'busted') {
                    badgeClass = 'badge-busted';
                    badgeText = 'Inactividad detectada';
                  } else if (report.status === 'grinder') {
                    badgeClass = 'badge-grinder';
                    badgeText = 'Sesion prolongada';
                  } else if (report.status === 'isolated') {
                    badgeClass = 'badge-isolated';
                    badgeText = 'Evento unico (0 min)';
                  }

                  return (
                    <tr key={report.player} className="table-row">
                      <td className="player-cell">
                        <span className="player-avatar">{report.player.charAt(0).toUpperCase()}</span>
                        <span className="player-name">{report.player}</span>
                      </td>
                      <td className="text-center font-bold">{report.sessions}</td>
                      <td className="text-center font-bold text-accent">
                        {report.longest} <span className="unit">min</span>
                      </td>
                      <td>
                        <span className={`status-badge ${badgeClass}`}>{badgeText}</span>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn-view-details"
                          onClick={() => onSelectPlayer(report)}
                        >
                          <Eye size={14} />
                          <span>Ver sesiones</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="raw-output-section">
          <div className="raw-output-header">
            <span>Retorno de huntAFK():</span>
          </div>
          <pre className="raw-output-box">
            {JSON.stringify(rawResult, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
