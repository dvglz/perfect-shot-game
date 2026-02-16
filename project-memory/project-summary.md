# Project Summary

## Product
- Game: timed basketball shooting game.
- Current stack: Phaser 3 with a single scene in `script.js`.
- Goal: revamp game and prepare integration into Playhub.

## Confirmed Inputs (Kickoff, 2026-02-16)
- Keep core shooting mechanic.
- Re-evaluate if Phaser is still the right runtime choice.
- Replace rigid player-asset handling with a flexible player system:
  - Supports active players and legends.
  - Handles traded players without brittle asset assumptions.
  - Supports appearance controls (jersey colors, numbers, proportions, hairstyle, skin tone).
- Improve mobile performance and UX.
- Plan UI refresh (design references pending).
- Add Playhub/SBC-style auth flow.

## Current Technical Snapshot
- Single HTML page (`index.html`) with Phaser loaded from CDN.
- Core logic and data are hardcoded in `script.js`.
- Player list is embedded in code and tied to static local images.

## Near-Term Focus
1. Architecture decision: keep Phaser or migrate.
2. Data model for players + appearance variants.
3. Mobile-first rendering/performance pass.
4. Playhub integration surface (auth + profile/session).
