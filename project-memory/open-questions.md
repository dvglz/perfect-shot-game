# Open Questions

## Product and Scope
- What is the target scope for v2: polish existing mode only, or add modes/challenges?
- What are Playhub acceptance criteria (MVP checklist, events/analytics requirements)?

## Tech Stack
- Keep Phaser 3, upgrade Phaser version, or migrate away from Phaser?
- If migrating, what rendering/runtime stack is preferred (vanilla canvas, Pixi, custom)?
- Confirm ADR-0002 proposal:
  - Keep Phaser for v2 MVP and defer migration decision to a later checkpoint?

## Player System
- What is the source of truth for player metadata (manual JSON, CMS, API)?
- How should appearance customization be implemented:
  - Layered compositing (body/jersey/hair/accessories)?
  - Pre-rendered atlases by archetype?
- Which visual attributes are mandatory for launch vs post-launch?
- How many player archetypes are needed for believable variation?

## Mobile and UX
- Target devices and minimum performance profile?
- Portrait only or portrait + landscape?
- Input model: tap-hold-release only, or extra gestures/haptics?
- Are we targeting 60 FPS on mid-tier devices as the primary performance target?

## Integration
- Which auth provider and flow are required for Playhub parity with SBC?
- How should user identity map to save data and progression?
