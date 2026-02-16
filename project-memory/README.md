# Project Memory

This folder is the long-lived knowledge base for the `nba-timed-shot` revamp.
Use it to keep context between sessions so decisions and open questions are not lost.

## Files
- `project-summary.md`: Current product + technical state in one place.
- `decision-log.md`: Confirmed decisions (ADR-style, append-only).
- `open-questions.md`: Questions waiting on product/design/engineering input.
- `problem-solving-log.md`: Debugging notes, experiments, and outcomes.
- `playhub-integration.md`: Auth/data/session integration notes for Playhub.
- `sessions/`: Chronological session summaries.

## Update Rules
1. Add a new file in `sessions/` for each work session (`YYYY-MM-DD-topic.md`).
2. Promote stable decisions from session notes into `decision-log.md`.
3. Keep `open-questions.md` short and current.
4. Update `project-summary.md` after meaningful scope/architecture changes.
5. Record failed and successful technical experiments in `problem-solving-log.md`.

## Writing Style
- Prefer concrete facts over speculation.
- Include paths and technical references when relevant.
- Use dates for every new section.
