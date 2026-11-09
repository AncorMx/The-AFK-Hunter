export interface GameEvent {
  player: string;
  time: string; // Formato 24h: "HH:MM"
}

export interface SessionDetail {
  sessionNumber: number;
  startTime: string;
  endTime: string;
  duration: number; // en minutos
  eventCount: number;
}

export interface PlayerReport {
  player: string;
  sessions: number;
  longest: number; // en minutos
  totalEvents: number;
  sessionsList: SessionDetail[];
  status: 'busted' | 'grinder' | 'regular' | 'isolated';
}

export type HuntAFKResult = Record<string, { sessions: number; longest: number }>;

