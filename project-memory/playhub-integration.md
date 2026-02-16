# Playhub Integration Notes

## Objective
Integrate the revamped timed-shot game into Playhub with auth/session behavior aligned with existing Playhub/SBC patterns.

## Integration Tracks
1. Auth flow
2. Player identity and profile
3. Session lifecycle
4. Score/progression persistence
5. Analytics/events

## Known Requirements (Kickoff)
- Add auth flow comparable to Playhub/SBC.
- Prepare game architecture for integration rather than standalone-only operation.

## Open Integration Questions
- What exact auth mechanism is used in Playhub/SBC (token type, refresh model, iframe/top-level constraints)?
- How is the game embedded (standalone route, iframe, web component)?
- Which events must be emitted and in what schema?
- What backend endpoints are available for score and progression writes?
- Is offline/guest mode allowed before auth is complete?

## Draft Interface Boundaries
- `AuthAdapter`: login state, token retrieval, logout, user profile.
- `SessionAdapter`: start/end session, run metadata, anti-cheat timestamping.
- `ProgressAdapter`: submit score, fetch history, update achievements.
- `AnalyticsAdapter`: standardized event dispatch.

These are placeholders until Playhub contract details are confirmed.
