# Empty state animation

Standalone clickable prototype of Eudia’s **All your projects** empty state, from [Product Refinement 2026](https://www.figma.com/design/mQcRYmMMxgpul28qjooiYA/Product-Refinement-2026?node-id=2751-30454).

The Figma frame has no authored motion. The floating project tiles use a local entrance + drift animation so the empty state can be reviewed in the browser.

## Run

```bash
pnpm install
pnpm dev
```

Opens at http://localhost:5173.

## What you can click

- Sidebar destinations (placeholder panes except All projects)
- Type filters: Favorites, General, Compliance, M&A, Litigation
- Ownership tabs and search
- **+ Project** to create a project and leave the empty state
- General starts empty (matches Figma). Other types have sample rows.
