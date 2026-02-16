# Decision Log

Format:
- `ID`: ADR-style identifier.
- `Date`: YYYY-MM-DD.
- `Status`: proposed | accepted | rejected | superseded.
- `Decision`: short statement.
- `Rationale`: why.
- `Consequences`: impact and follow-up.

---

## ADR-0001
- Date: 2026-02-16
- Status: accepted
- Decision: Establish a persistent in-repo project-memory knowledge base.
- Rationale: Revamp scope includes product, architecture, art pipeline, mobile, and Playhub integration; context continuity is required.
- Consequences:
  - All future sessions should append summaries in `project-memory/sessions/`.
  - Stable decisions must be promoted to this file.

## ADR-0002
- Date: 2026-02-16
- Status: proposed
- Decision: Keep Phaser for v2 MVP while modularizing internals, then re-evaluate engine migration post-integration.
- Rationale: Current blockers are mostly architecture/data-model coupling rather than missing engine capability.
- Consequences:
  - Requires refactor into engine-agnostic core modules.
  - Migration decision is deferred until mobile profiling and Playhub integration baseline are complete.
