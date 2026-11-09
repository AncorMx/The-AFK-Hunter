import type { GameEvent, HuntAFKResult, PlayerReport, SessionDetail } from '../types/afk.types';

export function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return -1;
  const [hStr, mStr] = timeStr.trim().split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return -1;
  return h * 60 + m;
}

export function minutesToTime(totalMins: number): string {
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function huntAFK(events: GameEvent[] = [], afkLimit: number = 30): HuntAFKResult {
  if (!events || !Array.isArray(events) || events.length === 0) {
    return {};
  }

  const limit = afkLimit > 0 ? afkLimit : 30;
  const playerGroups: Record<string, number[]> = {};

  for (const { player, time } of events) {
    if (!player || !time) continue;
    const cleanPlayer = player.trim();
    const mins = timeToMinutes(time);
    if (mins < 0) continue;

    if (!playerGroups[cleanPlayer]) {
      playerGroups[cleanPlayer] = [];
    }
    playerGroups[cleanPlayer].push(mins);
  }

  const sortedPlayers = Object.keys(playerGroups).sort((a, b) => a.localeCompare(b));
  const result: HuntAFKResult = {};

  for (const player of sortedPlayers) {
    const times = playerGroups[player].sort((a, b) => a - b);

    let sessions = 1;
    let longest = 0;
    let start = times[0];
    let end = start;

    for (let i = 1; i < times.length; i++) {
      const current = times[i];
      const gap = current - end;

      if (gap <= limit) {
        end = current;
      } else {
        longest = Math.max(longest, end - start);
        sessions++;
        start = current;
        end = current;
      }
    }

    longest = Math.max(longest, end - start);
    result[player] = { sessions, longest };
  }

  return result;
}

export function huntAFKDetailed(events: GameEvent[] = [], afkLimit: number = 30): PlayerReport[] {
  if (!events || !Array.isArray(events) || events.length === 0) {
    return [];
  }

  const limit = afkLimit > 0 ? afkLimit : 30;
  const playerGroups: Record<string, number[]> = {};

  for (const { player, time } of events) {
    if (!player || !time) continue;
    const cleanPlayer = player.trim();
    const mins = timeToMinutes(time);
    if (mins < 0) continue;

    if (!playerGroups[cleanPlayer]) {
      playerGroups[cleanPlayer] = [];
    }
    playerGroups[cleanPlayer].push(mins);
  }

  const sortedPlayers = Object.keys(playerGroups).sort((a, b) => a.localeCompare(b));
  const reports: PlayerReport[] = [];

  for (const player of sortedPlayers) {
    const times = playerGroups[player].sort((a, b) => a - b);

    let sessionCount = 1;
    let longest = 0;
    let start = times[0];
    let end = start;
    let eventsInSession = 1;
    const sessionsList: SessionDetail[] = [];

    for (let i = 1; i < times.length; i++) {
      const current = times[i];
      const gap = current - end;

      if (gap <= limit) {
        end = current;
        eventsInSession++;
      } else {
        const duration = end - start;
        longest = Math.max(longest, duration);
        sessionsList.push({
          sessionNumber: sessionCount,
          startTime: minutesToTime(start),
          endTime: minutesToTime(end),
          duration,
          eventCount: eventsInSession,
        });

        sessionCount++;
        start = current;
        end = current;
        eventsInSession = 1;
      }
    }

    const lastDuration = end - start;
    longest = Math.max(longest, lastDuration);
    sessionsList.push({
      sessionNumber: sessionCount,
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
      duration: lastDuration,
      eventCount: eventsInSession,
    });

    let status: PlayerReport['status'] = 'regular';
    if (sessionCount > 1 && longest === 0) {
      status = 'busted';
    } else if (longest >= 45) {
      status = 'grinder';
    } else if (times.length === 1) {
      status = 'isolated';
    }

    reports.push({
      player,
      sessions: sessionCount,
      longest,
      totalEvents: times.length,
      sessionsList,
      status,
    });
  }

  return reports;
}
