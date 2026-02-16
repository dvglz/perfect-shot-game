Original prompt: ok, here's some old game made on phaser, i want to revamp it, discuss changes and prepare new version integrated to playhub.

## 2026-02-16
- Initialized project memory system under `project-memory/`.
- Captured kickoff constraints and goals from the user:
  - Core mechanic can stay.
  - Evaluate whether Phaser should remain.
  - Build flexible player data + appearance system (active + legends, trades, visual attributes).
  - Improve mobile optimization.
  - Plan UI revamp (reference examples pending from user).
  - Add auth flow aligned with Playhub/SBC patterns.
- Next TODO:
  - Audit current game loop and Phaser coupling points in `script.js`.
  - Define migration options (keep Phaser vs vanilla canvas/WebGL stack).
  - Draft Playhub integration interface (auth/session/profile hooks).

## 2026-02-16 (architecture audit update)
- Completed architecture audit and documented findings in `project-memory/architecture-audit.md`.
- Added session log: `project-memory/sessions/2026-02-16-architecture-audit.md`.
- Added proposed decision `ADR-0002` in `project-memory/decision-log.md`:
  - Keep Phaser for v2 MVP, modularize internals, re-evaluate migration later.
- Updated open questions to request confirmation of ADR-0002 and target mobile FPS expectations.
- Next TODO:
  - If ADR-0002 is accepted, start refactor step 1: extract player catalog from `script.js` to `game/data/players.js`.
  - Define player schema for active + legend support and appearance attributes.
  - Create Playhub adapter stubs (`AuthAdapter`, `SessionAdapter`, `ProgressAdapter`, `AnalyticsAdapter`).
