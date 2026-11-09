import React from 'react';
import { Sliders, Code2, Play } from 'lucide-react';

interface LogEditorProps {
  rawInput: string;
  setRawInput: (val: string) => void;
  afkLimit: number;
  setAfkLimit: (val: number) => void;
  onExecute: () => void;
  parsedEventsCount: number;
}

export const LogEditor: React.FC<LogEditorProps> = ({
  rawInput,
  setRawInput,
  afkLimit,
  setAfkLimit,
  onExecute,
  parsedEventsCount,
}) => {
  return (
    <div className="card editor-card">
      <div className="card-header">
        <div className="card-title">
          <Code2 size={18} className="text-accent" />
          <span>Registro de eventos</span>
        </div>
        <div className="event-counter-badge">
          {parsedEventsCount} {parsedEventsCount === 1 ? 'evento' : 'eventos'}
        </div>
      </div>

      <div className="card-body">
        <textarea
          className="code-editor"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="// Formato esperado: { player: 'pixel', time: '09:00' } o 'pixel, 09:00'..."
          rows={12}
          spellCheck={false}
        />

        <div className="editor-controls">
          <div className="afk-limit-group">
            <Sliders size={18} className="text-secondary" />
            <label htmlFor="afkLimit" className="limit-label">
              Limite de inactividad (minutos):
            </label>
            <input
              id="afkLimit"
              type="number"
              min="1"
              max="1440"
              value={afkLimit}
              onChange={(e) => setAfkLimit(Math.max(1, parseInt(e.target.value, 10) || 30))}
              className="limit-input"
            />
            <span className="limit-help">Valor por defecto: 30 minutos</span>
          </div>

          <button className="btn-execute" onClick={onExecute}>
            <Play size={18} />
            <span>Ejecutar huntAFK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
