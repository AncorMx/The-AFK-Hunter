import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Sliders, Globe } from 'lucide-react';

export const InterviewAnswers: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const questions = [
    {
      id: 1,
      icon: <Cpu size={20} className="text-accent" />,
      title: '1. What is the time complexity of your solution, and which step dominates it?',
      summary: 'Time Complexity: O(N log N) — Dominated by sorting event timestamps per player.',
      content: (
        <div className="faq-content">
          <p>
            Let <strong>N</strong> be the total number of events in the log, <strong>P</strong> the number of unique players, and <strong>k<sub>p</sub></strong> the number of events for player <em>p</em> (where &sum; k<sub>p</sub> = N).
          </p>
          <ul>
            <li>
              <strong>1. Grouping:</strong> Grouping all <em>N</em> events by player into a map takes <code>O(N)</code>.
            </li>
            <li>
              <strong>2. Sorting Timestamps (Dominant Step):</strong> For each player <em>p</em>, sorting their <em>k<sub>p</sub></em> timestamps takes <code>O(k<sub>p</sub> log k<sub>p</sub>)</code>. Summed across all players:
              <br />
              <code>&sum; O(k<sub>p</sub> log k<sub>p</sub>) &le; O(N log N)</code>.
            </li>
            <li>
              <strong>3. Linear Boundary Traversal:</strong> Iterating through sorted timestamps to compare consecutive gaps (<code>gap &le; limit</code>) takes linear time <code>O(k<sub>p</sub>)</code>, totaling <code>O(N)</code>.
            </li>
            <li>
              <strong>4. Alphabetical Output:</strong> Sorting <em>P</em> player names takes <code>O(P log P) &le; O(N log N)</code>.
            </li>
          </ul>
          <p className="faq-conclusion">
            <strong>Conclusion:</strong> The <strong>sorting of timestamps per player dominates</strong> the execution time, yielding an overall time complexity of <strong>O(N log N)</strong> and a space complexity of <strong>O(N)</strong> to store parsed events and session summaries.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      icon: <Sliders size={20} className="text-secondary" />,
      title: '2. Why is it a good idea to receive the AFK limit as a parameter instead of hardcoding 30?',
      summary: 'Promotes Open/Closed principle, game mode adaptability, and testability.',
      content: (
        <div className="faq-content">
          <p>
            Hardcoding magic numbers (like 30) tightly couples the business rule to a single scenario. Passing it as a configurable parameter provides three core architectural benefits:
          </p>
          <ol>
            <li>
              <strong>Game Mode Flexibility:</strong> Different game modes require different idle tolerances. A fast-paced Battle Royale might declare a player AFK after 5 or 10 minutes of inactivity, whereas an MMORPG involving trading, crafting, or dungeon queues might legitimately allow 45 to 60 minutes between keystrokes.
            </li>
            <li>
              <strong>Analytics & Telemetry Calibration:</strong> Anti-cheat and telemetry teams frequently perform simulations across historical logs with various thresholds (e.g., 15m, 30m, 45m) to find optimal anti-fraud metrics without touching or redeploying code.
            </li>
            <li>
              <strong>Inversion of Control & Testing:</strong> Unit tests can effortlessly inject arbitrary boundary limits (e.g., 1m, 10m) to verify edge cases and exact gap matches cleanly.
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 3,
      icon: <Globe size={20} className="text-success" />,
      title: '3. If the events arrived in real time from millions of players, what would you change in your approach?',
      summary: 'Transition from batch processing to partitioned streaming (Kafka) and stateful session windows (Flink/Redis).',
      content: (
        <div className="faq-content">
          <p>
            An in-memory batch approach cannot scale to millions of concurrent players streaming millions of events per second. The architecture would shift to an <strong>Event-Driven Streaming Pipeline</strong>:
          </p>
          <ol>
            <li>
              <strong>Distributed Stream Partitioning (Apache Kafka / AWS Kinesis):</strong>
              <br />
              Partition telemetry events using <code>player_id</code> as the partition key. This guarantees strict FIFO delivery order per player while scaling horizontally across consumer instances.
            </li>
            <li>
              <strong>Stream Processing with Session Windows (Apache Flink / Kafka Streams):</strong>
              <br />
              Utilize native <strong>Session Windows with an inactivity gap of 30 minutes</strong> and event-time watermarks. This handles out-of-order and network-delayed packets natively without memory-heavy global batch sorting.
            </li>
            <li>
              <strong>Lightweight In-Memory State Store with TTL (Redis Cluster):</strong>
              <br />
              Instead of hoarding raw event logs, maintain only active session metadata in memory:
              <br />
              <code>&#123; current_session_start, last_event_time, session_count, max_duration &#125;</code>.
              <br />
              When an event arrives: if <code>now - last_event &le; 30m</code>, update <code>last_event</code>; otherwise, seal the previous session and increment <code>session_count</code>. An expiring Redis TTL automatically evicts inactive players from RAM.
            </li>
            <li>
              <strong>Decoupled Analytical Lake (ClickHouse / Snowflake):</strong>
              <br />
              Emit finalized session records asynchronously to a columnar database for real-time dashboards and studio analytics without degrading ingestion latency.
            </li>
          </ol>
        </div>
      ),
    },
  ];

  return (
    <div className="card interview-card">
      <div className="card-header">
        <div className="card-title">
          <HelpCircle size={18} className="text-accent" />
          <span>Technical Interview Questions & Answers (English)</span>
        </div>
      </div>

      <div className="card-body">
        <div className="accordion">
          {questions.map((q, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={q.id} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                <button className="accordion-trigger" onClick={() => toggle(idx)}>
                  <div className="accordion-title-row">
                    {q.icon}
                    <div className="text-left">
                      <h4 className="accordion-title">{q.title}</h4>
                      <p className="accordion-summary">{q.summary}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && <div className="accordion-panel">{q.content}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

