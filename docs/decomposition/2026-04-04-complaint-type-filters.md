## Decomposition
- Feature doc: `docs/features/2026-04-04-complaint-type-summary-and-filters.md`
- Backbone: search an address -> understand the dominant complaint types nearby -> focus on one complaint type -> scan the affected addresses
- Walking skeleton: derive complaint-type counts from the already-fetched results, show the top few complaint types as tappable chips above the existing list, let the user select one type, and switch the results into a compact address-first list for that selected type with an `All` chip to return to the full-card view

### Slice 1: Complaint type summary and single-select chips
- User value: Users can understand the dominant complaint types near an address within a few seconds instead of reading every card.
- Scope: Count complaint types from the existing fetched complaints, sort the top 3-5 categories, and render them as chips above the results area. Include `All` as the reset state.
- Seams involved: Client-side complaint aggregation, presentation state for a selected complaint type, small home-screen summary UI.
- Why it can land independently: Even without changing the list layout yet, the chip summary makes the current search results more legible and strengthens the core “what are neighbors complaining about?” question.
- Risks or open questions: Raw 311 type labels may be noisy. The first pass should use the top categories as-is and avoid premature normalization.

### Slice 2: Filtered address-first view for a selected complaint type
- User value: Once users pick a complaint type, they can quickly see where that specific issue is happening instead of scanning repeated full cards.
- Scope: When a complaint-type chip is selected, switch the result list into a compact address-first mode that shows address, status, and filed date for only that complaint type. Preserve `All` to return to the full-card view.
- Seams involved: Result-view mode switching, compact row component, client-side filtered data selection.
- Why it can land independently: This slice directly answers the next user question after the summary: “where is this issue happening?” It does not require any new data source or backend changes.
- Risks or open questions: Some complaints may have missing addresses. The compact list should handle that gracefully without breaking the scan pattern.

### Slice 3: Small label cleanup and sparse-state handling
- User value: The feature remains understandable when the result set is small or category labels are awkward.
- Scope: Add simple rules for sparse data: hide the summary when there are too few results to make it useful, or reduce the chip count. Optionally trim very long labels for chip readability without inventing a taxonomy system.
- Seams involved: Presentation thresholds, chip-label formatting, empty/sparse-state copy.
- Why it can land independently: It is polish on top of the first two slices and can be deferred if the raw data already feels good enough.
- Risks or open questions: Thresholds may need a couple of real-device passes to avoid over-hiding useful data.

### Slice 4: Optional lightweight type normalization
- User value: Users see cleaner categories if raw 311 complaint types prove too granular or repetitive.
- Scope: Add a very small normalization map only for obviously duplicated or awkward labels discovered in real usage.
- Seams involved: Complaint-type aggregation helper, normalization mapping, summary rendering.
- Why it can land independently: It improves signal quality without changing the overall feature shape and should only happen if real use shows the raw labels are too messy.
- Risks or open questions: Over-normalization could hide meaningful distinctions too early, so this should stay deliberately conservative.

## Delivery Order
- 1. Slice 1: Complaint type summary and single-select chips
- 2. Slice 2: Filtered address-first view for a selected complaint type
- 3. Slice 3: Small label cleanup and sparse-state handling
- 4. Slice 4: Optional lightweight type normalization

## Next Step
- Move Slice 1 into `build`
