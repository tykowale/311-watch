## Plan
- [x] Add a small client-side aggregation seam that derives top complaint-type counts from the already-fetched complaint results
- [x] Render a lightweight complaint-type summary with single-select chips plus an `All` reset state above the existing results list
- [x] Wire the selected chip into the current screen state so the summary is interactive and ready for the later compact address-first filtered view
- [x] Verify the slice with focused tests, lint, and typecheck
