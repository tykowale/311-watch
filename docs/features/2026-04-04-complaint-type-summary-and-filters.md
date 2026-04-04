## Feature Brief
- Problem: The current MVP answers "what complaints are near this address?" but it is still work for the user to infer the main neighborhood signal from a long list. When there are many results, the list is informative but not especially legible.
- Audience: Curious residents, renters, homebuyers, and neighborhood scouts who want a quick read on what people around a Chicago address are complaining about to 311.
- Why now: The MVP already proves the address search and complaint feed. The next highest-value step is improving comprehension of the results users already asked for, without adding paid APIs, auth, or backend complexity.
- Proposed direction: Add a lightweight complaint-type summary above the list and a small set of quick filter chips. Show the top complaint categories from the fetched results, let the user tap a category chip to enter a focused view for that complaint type, and include an `All` chip to reset. In the focused view, switch from the full complaint cards to a tighter address-first list so users can quickly see where that specific issue is happening.
- Constraints: No paid APIs. No backend. No auth. Keep the experience mobile-first and incremental. Prefer using the complaints already fetched for the address search instead of introducing a second data pipeline unless it becomes necessary.
- Non-goals: No charts. No map view. No complex taxonomy cleanup system. No multi-select filters. No saved-search system. No server-side analytics. No extra dashboard shell.
- Success criteria: Users can tell the dominant complaint types near an address within a few seconds. Users can enter a complaint-type-focused view with one tap. In that focused view, users can scan affected addresses faster than they can in the current full-card list. The summary and filters remain understandable on small screens. The feature reuses the existing data flow and does not materially slow down the current search experience.
- Risks or open questions: Raw 311 complaint types may be noisy or overly granular, so the first pass should limit itself to the top few categories instead of exposing the entire taxonomy. If the returned result set is too sparse, the summary may not add much value. If category labels feel messy in practice, we may need a small normalization pass later.
- Recommended next step: Build the smallest version of complaint-type summary plus quick filters first. Specifically: count categories from the fetched complaints, render the top 3-5 categories as chips above the list, allow one active chip at a time, and when a chip is selected switch the results into a compact address-first list for that complaint type. Include an `All` chip to return to the normal full-card list.

## Notes
- Alternatives considered:
  - Saved/recent searches: useful, but better as a retention feature after the core insight gets stronger.
  - Map view: attractive, but too likely to become a UI and dependency project before we learn enough from the core list flow.
- Filtered-view refinement:
  - Once a complaint type is selected, the user question changes from "what kinds of complaints are here?" to "where is this specific issue happening?" The UI should reflect that by prioritizing addresses over repeated full cards.
- Devil's-advocate conclusion: summary plus filters is the best fit for the product promise with the least implementation risk.
