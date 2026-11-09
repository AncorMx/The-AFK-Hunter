import React from 'react';
import { PlayCircle, Shuffle, UserMinus, Trash2 } from 'lucide-react';

interface PresetsBarProps {
  onSelectPreset: (presetText: string, limit?: number) => void;
}

export const PRESET_OFFICIAL = `[
  { player: 'pixel',  time: '09:00' },
  { player: 'shadow', time: '09:05' },
  { player: 'pixel',  time: '09:20' },
  { player: 'pixel',  time: '09:50' },
  { player: 'pixel',  time: '10:45' },
  { player: 'shadow', time: '09:36' },
  { player: 'pixel',  time: '11:00' }
]`;

export const PRESET_MIXED = `// Eventos mixtos de varios jugadores
vortex, 14:10
pixel, 11:15
shadow, 08:30
vortex, 14:25
nova, 20:00
pixel, 11:35
vortex, 15:10
shadow, 08:50
nova, 20:40
vortex, 15:30
cyber, 18:00
`;

export const PRESET_ISOLATED = `// Eventos aislados de un solo registro
alpha, 10:00
beta, 15:30
gamma, 22:15
`;

export const PresetsBar: React.FC<PresetsBarProps> = ({ onSelectPreset }) => {
  return (
    <div className="presets-container">
      <span className="presets-label">Casos de prueba:</span>
      <div className="presets-buttons">
        <button
          className="btn-preset btn-preset-primary"
          onClick={() => onSelectPreset(PRESET_OFFICIAL, 30)}
        >
          <PlayCircle size={15} />
          <span>Caso oficial (Pixel y Shadow)</span>
        </button>

        <button
          className="btn-preset"
          onClick={() => onSelectPreset(PRESET_MIXED, 30)}
        >
          <Shuffle size={15} />
          <span>Eventos mixtos</span>
        </button>

        <button
          className="btn-preset"
          onClick={() => onSelectPreset(PRESET_ISOLATED, 30)}
        >
          <UserMinus size={15} />
          <span>Sesiones unitarias (0 min)</span>
        </button>

        <button
          className="btn-preset btn-preset-danger"
          onClick={() => onSelectPreset('', 30)}
        >
          <Trash2 size={15} />
          <span>Registro vacio</span>
        </button>
      </div>
    </div>
  );
};
