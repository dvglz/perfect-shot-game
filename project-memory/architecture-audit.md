# Architecture Audit (Current `script.js`)
Date: 2026-02-16

## Scope reviewed
- `index.html`
- `script.js`

## Current structure
- Single Phaser scene (`preload`, `create`, `update`) with almost all logic in one file.
- Game state is held in mutable globals (`score`, `timer`, `started`, clutch flags, player references).
- Rendering, input handling, rules, randomness, and UI overlays are tightly coupled.
- Player data is hardcoded in `script.js` and tied directly to static image filenames.

## Phaser dependency map
- Strong Phaser usage:
  - Scene lifecycle (`preload/create/update`)
  - Display tree creation (`this.add.*`)
  - Tweens (`this.tweens.add`)
  - Timer events (`this.time.addEvent`)
  - Input listeners (`this.input.keyboard`, pointer events)
  - Utility randomness/math (`Phaser.Math`, `Phaser.Utils.Array`)
- Not used:
  - Arcade/Matter physics
  - Tilemaps
  - Cameras/advanced post-processing
  - Complex multi-scene composition

## Technical findings
- `script.js` combines engine, game domain logic, UI, and integration logic; this is the main maintainability bottleneck.
- Restart flow uses listener/event cleanup patterns that are fragile in a single global-state file.
- There is no integration boundary yet for auth/session/analytics (needed for Playhub).
- Mobile responsiveness is partly handled by Phaser FIT mode, but UI sizes and hit areas are fixed to a portrait baseline (600x1000).

## Option analysis
## Option A: Keep Phaser for v2 and modularize
- Pros:
  - Lowest migration risk and fastest path to Playhub-ready MVP.
  - Existing behavior can be preserved while refactoring internals.
  - Good enough for this mechanic; no heavy engine constraints are currently blocking.
- Cons:
  - Bundle/runtime still includes Phaser overhead.
  - Long-term control is less than a custom engine loop.

## Option B: Migrate off Phaser now
- Pros:
  - Smaller/custom runtime and tighter control over performance and architecture.
  - Clean slate for deterministic loop + integration interfaces.
- Cons:
  - Higher short-term cost and regression risk.
  - Delays Playhub integration until mechanics parity is rebuilt.

## Recommendation
- Recommended path: **Option A (keep Phaser now)** with a strict modular architecture, then re-evaluate migration after Playhub integration and mobile profiling.
- Reason: current code issues are primarily architecture/data concerns, not engine capability limits.

## Proposed v2 module boundaries
- `game/core/state.js`: serializable game state and pure state transitions.
- `game/core/rules.js`: shot accuracy, scoring, clutch rules.
- `game/data/players.js`: player catalog and metadata loading.
- `game/render/phaser-scene.js`: Phaser-only rendering and animation layer.
- `game/input/controls.js`: pointer/keyboard (later touch/haptic abstraction).
- `integrations/playhub/*.js`: auth, session, progress, analytics adapters.
- `ui/overlays/*.js`: start, endgame, modal/UI components.

## Immediate implementation order
1. Extract player catalog out of `script.js` into data module.
2. Extract pure rules functions (`getAccuracy`, scoring, clutch transitions).
3. Add integration adapter interfaces with no-op implementations.
4. Add responsive UI scale tokens for mobile hit areas/text.
5. Add automated browser test loop for regression checks after each step.
