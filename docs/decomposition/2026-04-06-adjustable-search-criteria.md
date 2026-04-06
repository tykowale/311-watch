## Decomposition
- Feature doc: `docs/features/2026-04-06-adjustable-search-criteria.md`
- Backbone: search an address -> see nearby complaints with sensible defaults -> change distance or time window -> immediately see a refreshed result set for the same address
- Walking skeleton: after an address search, show compact preset controls for distance and time window, default them to the current half-mile and 7-day values, and rerun the existing nearby-complaints query immediately when the user taps a new preset

### Slice 1: Adjustable search criteria
- User value: Users can narrow or widen the current search without re-entering the address or leaving the main flow.
- Scope: Add a small set of preset distance and time-window controls tied to the current address search, keep the current defaults selected initially, rerun immediately when a preset changes, and keep the selected criteria and loading state understandable in the results flow. Include basic empty-state handling when stricter criteria return no results.
- Seams involved: Search-criteria state, existing complaint query inputs, compact controls in the main search/results flow, selected-state presentation, refresh UX.
- Execution seams: UI preset controls, criteria state wiring, query parameter updates, loading and selected-state behavior, focused test coverage for criteria-driven refresh behavior.
- Agent shape: multiple agents
- Why it can land independently: This is the smallest full vertical slice that proves the feature end to end and leaves the product in a complete, understandable state rather than a partially wired one.
- Risks or open questions: Quick successive taps could create noisy loading behavior. The first pass should keep the presets small and the loading state obvious rather than trying to optimize aggressively.

### Slice 2: Criteria changes in focused complaint-type mode
- User value: Users keep a coherent experience when they change search criteria after entering the complaint-type-focused flow.
- Scope: Decide and implement how complaint-type summary chips and focused address-first mode behave after the underlying result set refreshes under new criteria, including sparse-result and no-result cases.
- Seams involved: Interaction between refreshed results and complaint-type-focused mode, summary-chip visibility thresholds, state-reset or state-preservation rules.
- Execution seams: Focused-filter state behavior, summary-chip rendering rules, empty or sparse-state messaging, regression tests around criteria changes.
- Agent shape: multiple agents
- Why it can land independently: The core adjustable-search feature already works after Slice 1, and this slice hardens the interaction with the newer complaint-type summary flow.
- Risks or open questions: Preserving a previously selected complaint type across a refreshed result set may be useful or may feel broken if that type disappears. This is best decided after the base criteria flow is working.

## Delivery Order
- 1. Slice 1: Adjustable search criteria
- 2. Slice 2: Criteria changes in focused complaint-type mode

## Next Step
- Move Slice 1 into `build`
