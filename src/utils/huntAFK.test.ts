import { describe, it, expect } from 'vitest';
import { huntAFK } from './huntAFK';
import type { GameEvent } from '../types/afk.types';

describe('huntAFK', () => {
  it('calcula las sesiones y duracion del caso oficial', () => {
    const events: GameEvent[] = [
      { player: 'pixel', time: '09:00' },
      { player: 'shadow', time: '09:05' },
      { player: 'pixel', time: '09:20' },
      { player: 'pixel', time: '09:50' },
      { player: 'pixel', time: '10:45' },
      { player: 'shadow', time: '09:36' },
      { player: 'pixel', time: '11:00' },
    ];

    const result = huntAFK(events);

    expect(result).toEqual({
      pixel: { sessions: 2, longest: 50 },
      shadow: { sessions: 2, longest: 0 },
    });

    const keys = Object.keys(result);
    expect(keys).toEqual(['pixel', 'shadow']);
  });

  it('retorna objeto vacio si la lista es vacia o nula', () => {
    expect(huntAFK([])).toEqual({});
    expect(huntAFK(null as unknown as GameEvent[])).toEqual({});
    expect(huntAFK(undefined)).toEqual({});
  });

  it('mantiene la misma sesion si el intervalo es exactamente 30 minutos', () => {
    const events: GameEvent[] = [
      { player: 'hero', time: '10:00' },
      { player: 'hero', time: '10:30' },
    ];

    const result = huntAFK(events, 30);
    expect(result.hero).toEqual({ sessions: 1, longest: 30 });
  });

  it('inicia nueva sesion si el intervalo supera el limite de 30 minutos', () => {
    const events: GameEvent[] = [
      { player: 'hero', time: '10:00' },
      { player: 'hero', time: '10:31' },
    ];

    const result = huntAFK(events, 30);
    expect(result.hero).toEqual({ sessions: 2, longest: 0 });
  });

  it('asigna 0 minutos a una sesion de un solo evento', () => {
    const events: GameEvent[] = [{ player: 'solo', time: '15:45' }];
    const result = huntAFK(events);
    expect(result.solo).toEqual({ sessions: 1, longest: 0 });
  });

  it('aplica correctamente un limite personalizado de inactividad', () => {
    const events: GameEvent[] = [
      { player: 'runner', time: '12:00' },
      { player: 'runner', time: '12:15' },
    ];

    const strict = huntAFK(events, 10);
    expect(strict.runner).toEqual({ sessions: 2, longest: 0 });

    const relaxed = huntAFK(events, 20);
    expect(relaxed.runner).toEqual({ sessions: 1, longest: 15 });
  });

  it('genera el mismo resultado independientemente del orden de los eventos recibidos', () => {
    const reversedEvents: GameEvent[] = [
      { player: 'pixel', time: '11:00' },
      { player: 'shadow', time: '09:36' },
      { player: 'pixel', time: '10:45' },
      { player: 'pixel', time: '09:50' },
      { player: 'pixel', time: '09:20' },
      { player: 'shadow', time: '09:05' },
      { player: 'pixel', time: '09:00' },
    ];

    expect(huntAFK(reversedEvents)).toEqual({
      pixel: { sessions: 2, longest: 50 },
      shadow: { sessions: 2, longest: 0 },
    });
  });
});
