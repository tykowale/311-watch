## Feature Brief
- Problem: The current 311 search only shows one fixed slice of nearby complaints: half a mile over the last 7 days. That is a good default, but it breaks down when a user wants either a tighter read on a block or a broader read on a neighborhood.
- Audience: Curious residents, renters, homebuyers, and neighborhood scouts who want to tune how broad or recent the 311 signal is for a searched address.
- Why now: The app already proves the core address-first workflow and the complaint-type summary on top of it. The next highest-value improvement is letting users change the search scope without adding backend complexity or forcing them into a different flow.
- Proposed direction: Keep the current default criteria, then add a small set of preset controls for distance and time window so users can quickly narrow or widen the current search. The first version should favor tap targets over freeform input and keep the active criteria visible enough that the result set stays understandable.
- Constraints: Stay mobile-first. No auth. No backend. No saved searches. No freeform radius or date input in the first pass. Reuse the existing Chicago 311 client and query layer. Preserve the current default experience as the starting point.
- Non-goals: No pagination in this slice. No map view. No advanced sorting. No arbitrary filtering system. No saved criteria profiles. No background refresh.
- Success criteria: A user can change distance and time window in the app with one or two taps. The result list updates for the same searched address using the new criteria. The current active criteria remain legible on a small screen, and the default path still feels fast and simple for first-time use.
- Risks or open questions: The main product risk is adding controls that feel heavier than the current MVP. The first pass should stay constrained to a few presets so the UI remains compact. We should also confirm whether criteria changes should re-run immediately or require an explicit apply action; immediate re-run is likely the better default if loading remains clear and responsive.
- Recommended next step: Decompose and build the smallest criteria-control slice: preset distance and time-window options, defaulted to the current values, with a refreshed result set for the current address and clear visibility into which criteria are active.

## Notes
- Alternatives considered:
  - Pagination in the same slice: useful, but it broadens both product and data-flow complexity before we learn whether adjustable criteria alone already improves exploration.
  - Freeform inputs: more flexible, but too easy to make noisy or error-prone on mobile for the first pass.
- Devil's-advocate conclusion: preset criteria controls are the best next step because they deepen the core address search without introducing a second navigation pattern or a heavier query-management feature.
