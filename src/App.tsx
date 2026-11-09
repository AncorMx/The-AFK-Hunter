import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { PresetsBar, PRESET_OFFICIAL } from './components/PresetsBar';
import { LogEditor } from './components/LogEditor';
import { ResultsTable } from './components/ResultsTable';
import { SessionModal } from './components/SessionModal';
import { InterviewAnswers } from './components/InterviewAnswers';
import { parseRawEventLog } from './utils/logParser';
import { huntAFK, huntAFKDetailed } from './utils/huntAFK';
import type { PlayerReport } from './types/afk.types';
import { BarChart3, HelpCircle } from 'lucide-react';
import './App.css';

export const App: React.FC = () => {
  const [rawInput, setRawInput] = useState<string>(PRESET_OFFICIAL);
  const [afkLimit, setAfkLimit] = useState<number>(30);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerReport | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'interview'>('dashboard');

  const parsedEvents = useMemo(() => {
    return parseRawEventLog(rawInput);
  }, [rawInput]);

  const rawResult = useMemo(() => {
    return huntAFK(parsedEvents, afkLimit);
  }, [parsedEvents, afkLimit]);

  const detailedReports = useMemo(() => {
    return huntAFKDetailed(parsedEvents, afkLimit);
  }, [parsedEvents, afkLimit]);

  const handleSelectPreset = (presetText: string, limit: number = 30) => {
    setRawInput(presetText);
    setAfkLimit(limit);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={18} />
            <span>Panel de actividad</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            <HelpCircle size={18} />
            <span>Preguntas tecnicas</span>
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          <>
            <PresetsBar onSelectPreset={handleSelectPreset} />

            <div className="dashboard-grid">
              <LogEditor
                rawInput={rawInput}
                setRawInput={setRawInput}
                afkLimit={afkLimit}
                setAfkLimit={setAfkLimit}
                onExecute={() => {}}
                parsedEventsCount={parsedEvents.length}
              />

              <ResultsTable
                reports={detailedReports}
                rawResult={rawResult}
                onSelectPlayer={(player) => setSelectedPlayer(player)}
              />
            </div>
          </>
        ) : (
          <InterviewAnswers />
        )}
      </main>

      <SessionModal
        player={selectedPlayer}
        afkLimit={afkLimit}
        onClose={() => setSelectedPlayer(null)}
      />

      <footer className="footer">
        <p>Pixel Legends - AFK Hunter | React + TypeScript + Vite</p>
      </footer>
    </div>
  );
};

export default App;
