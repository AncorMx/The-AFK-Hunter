import type { GameEvent } from '../types/afk.types';

export function parseRawEventLog(rawInput: string): GameEvent[] {
  if (!rawInput || !rawInput.trim()) return [];

  const text = rawInput.trim();

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) => typeof item.player === 'string' && typeof item.time === 'string'
      );
    }
  } catch {
    // Si no es JSON estricto, procesar por expresiones regulares
  }

  const events: GameEvent[] = [];
  const objectRegex = /player\s*[:=]\s*['"]?([^'",\s}]+)['"]?[\s\S]*?time\s*[:=]\s*['"]?(\d{1,2}:\d{2})['"]?/gi;
  let match: RegExpExecArray | null;

  while ((match = objectRegex.exec(text)) !== null) {
    events.push({
      player: match[1].trim(),
      time: match[2].trim(),
    });
  }

  if (events.length > 0) {
    return events;
  }

  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const l = line.trim();
    if (!l || l.startsWith('//') || l.startsWith('#')) continue;

    const parts = l.split(/[,;\s\t]+/);
    if (parts.length >= 2) {
      const player = parts[0].replace(/[^a-zA-Z0-9_\-]/g, '').trim();
      const time = parts[1].replace(/[^0-9:]/g, '').trim();
      if (player && /^\d{1,2}:\d{2}$/.test(time)) {
        events.push({ player, time });
      }
    }
  }

  return events;
}
