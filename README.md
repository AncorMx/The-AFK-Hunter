# Pixel Legends - AFK Hunter Suite

Herramienta de auditoria de sesiones para el juego en linea Pixel Legends, desarrollada con React, TypeScript y Vite.

Procesa registros de eventos desordenados de multiples jugadores y determina cuantas sesiones reales tuvieron y la duracion de su sesion mas larga.

---

## Ejecucion local

### 1. Instalacion de dependencias
```bash
npm install
```

### 2. Iniciar en desarrollo
```bash
npm run dev
```
La aplicacion estara disponible en `http://localhost:5173`.

### 3. Ejecutar pruebas unitarias
```bash
npm test
```

### 4. Compilar para produccion
```bash
npm run build
```

---

## Estructura del proyecto

```text
pixel-legends-afk-hunter/
│
├── src/
│   ├── types/
│   │   └── afk.types.ts           # Definiciones de tipos (GameEvent, PlayerReport, etc.)
│   │
│   ├── utils/
│   │   ├── huntAFK.ts             # Funcion principal huntAFK
│   │   ├── huntAFK.test.ts        # Pruebas automatizadas con Vitest
│   │   └── logParser.ts           # Parser para diferentes formatos de entrada
│   │
│   ├── components/
│   │   ├── Navbar.tsx             # Encabezado principal
│   │   ├── PresetsBar.tsx         # Casos de prueba precargados
│   │   ├── LogEditor.tsx          # Editor de entrada y configuracion de limite
│   │   ├── ResultsTable.tsx       # Tabla de resultados y resumen
│   │   ├── SessionModal.tsx       # Detalle cronologico de sesiones por jugador
│   │   └── InterviewAnswers.tsx   # Respuestas a las preguntas tecnicas
│   │
│   ├── App.tsx                    # Componente principal
│   ├── App.css                    # Estilos de la aplicacion
│   └── main.tsx                   # Entrada de Vite
│
├── package.json
└── vite.config.ts
```

---

## Implementacion de huntAFK

```typescript
export function huntAFK(events: GameEvent[] = [], afkLimit: number = 30): HuntAFKResult {
  if (!events || !Array.isArray(events) || events.length === 0) return {};

  const limit = afkLimit > 0 ? afkLimit : 30;
  const playerGroups: Record<string, number[]> = {};

  for (const { player, time } of events) {
    if (!player || !time) continue;
    const [h, m] = time.trim().split(':').map(Number);
    (playerGroups[player.trim()] ||= []).push(h * 60 + m);
  }

  const sortedPlayers = Object.keys(playerGroups).sort((a, b) => a.localeCompare(b));
  const result: HuntAFKResult = {};

  for (const player of sortedPlayers) {
    const times = playerGroups[player].sort((a, b) => a - b);
    let sessions = 1, longest = 0, start = times[0], end = start;

    for (let i = 1; i < times.length; i++) {
      const current = times[i];
      if (current - end <= limit) {
        end = current;
      } else {
        longest = Math.max(longest, end - start);
        sessions++;
        start = end = current;
      }
    }
    longest = Math.max(longest, end - start);
    result[player] = { sessions, longest };
  }

  return result;
}
```

### Reglas aplicadas:
1. Una diferencia menor o igual al limite (por defecto 30 minutos) se mantiene en la misma sesion.
2. Una diferencia mayor al limite finaliza la sesion anterior y comienza una nueva.
3. Una sesion con un solo evento tiene una duracion de 0 minutos.
4. Los jugadores se listan en orden alfabetico.
5. Si el registro esta vacio o es nulo, devuelve un objeto vacio `{}` sin generar excepciones.

---

## Technical Interview Questions and Answers

### 1. What is the time complexity of your solution, and which step dominates it?

Let N be the total number of events in the log, P the number of unique players, and k_p the number of events for player p (where sum of k_p = N).

1. Grouping: Grouping all N events into a hash table takes O(N) time.
2. Sorting Timestamps per Player: For each player p, sorting their k_p timestamps takes O(k_p log k_p). Summed across all players:
   sum of O(k_p log k_p) <= O(N log N).
3. Linear Scan: Iterating through sorted timestamps to compare consecutive intervals takes linear time O(k_p) per player, totaling O(N).
4. Alphabetical Sorting of Players: Sorting the P player names takes O(P log P) <= O(N log N).

The sorting step of the timestamps dominates the runtime complexity. The overall time complexity is O(N log N), and the auxiliary space complexity is O(N) to store grouped timestamps and results.

---

### 2. Why is it a good idea to receive the AFK limit as a parameter instead of hardcoding 30 inside the function?

Hardcoding magic numbers couples the implementation to a single specific scenario. Passing the threshold as a parameter offers three practical benefits:

1. Game Mode Flexibility: Different game modes have different idle tolerances. A fast-paced match might consider a player AFK after 5 or 10 minutes, while an open-world MMO might allow 45 to 60 minutes between actions.
2. Calibration and Analytics: Studio telemetry teams can run simulations across historical logs using multiple thresholds without altering or deploying new code.
3. Unit Testing: Allows test cases to evaluate arbitrary limits (e.g. 1 minute, 10 minutes) cleanly.

---

### 3. If the events arrived in real time from millions of players, what would you change in your approach?

A batch in-memory model would not handle millions of players streaming events concurrently. The architecture would change to a stream processing model:

1. Partitioned Message Broker (e.g. Apache Kafka or AWS Kinesis): Partition incoming logs by player ID so that events for any given player are consumed in order by the same worker.
2. Stream Processing with Session Windows (e.g. Apache Flink): Use native session windowing with a 30-minute inactivity gap and event-time watermarks to naturally handle out-of-order arrivals.
3. In-Memory State Cache with TTL (e.g. Redis): Store only the minimal active state per player (session start, last seen, session count, max duration). A time-to-live expiration cleans up players who remain inactive.
4. Analytical Storage (e.g. ClickHouse): Write completed session summaries asynchronously to an analytical database for queries and reporting.
