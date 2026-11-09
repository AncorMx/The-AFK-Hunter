import React from 'react';
import type { PlayerReport } from '../types/afk.types';
import { X, Calendar, Clock, Activity, Flame } from 'lucide-react';

interface SessionModalProps {
  player: PlayerReport | null;
  afkLimit: number;
  onClose: () => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({ player, afkLimit, onClose }) => {
  if (!player) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="player-avatar large">{player.player.charAt(0).toUpperCase()}</span>
            <div>
              <h3 className="modal-player-name">{player.player}</h3>
              <p className="modal-subtitle">
                Desglose de sesiones (tolerancia: {afkLimit} min)
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-stats-grid">
            <div className="modal-stat-card">
              <Activity size={16} className="text-secondary" />
              <div>
                <span className="stat-label">Sesiones</span>
                <span className="stat-val">{player.sessions}</span>
              </div>
            </div>
            <div className="modal-stat-card">
              <Flame size={16} className="text-accent" />
              <div>
                <span className="stat-label">Sesion mas larga</span>
                <span className="stat-val">{player.longest} min</span>
              </div>
            </div>
            <div className="modal-stat-card">
              <Clock size={16} className="text-success" />
              <div>
                <span className="stat-label">Total eventos</span>
                <span className="stat-val">{player.totalEvents}</span>
              </div>
            </div>
          </div>

          <h4 className="sessions-list-title">Historial de sesiones</h4>

          <div className="sessions-list">
            {player.sessionsList.map((session) => (
              <div key={session.sessionNumber} className="session-card">
                <div className="session-card-left">
                  <div className="session-badge">Sesion #{session.sessionNumber}</div>
                  <div className="session-timeframe">
                    <Calendar size={14} />
                    <span>
                      {session.startTime} — {session.endTime}
                    </span>
                  </div>
                </div>

                <div className="session-card-right">
                  <div className="session-duration-pill">
                    <Clock size={14} />
                    <span>{session.duration} min</span>
                  </div>
                  <span className="session-events-tag">
                    {session.eventCount} {session.eventCount === 1 ? 'evento' : 'eventos'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
