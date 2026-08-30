# Agency Task Board

A single-screen operations board for a small agency: three columns — **To Do**,
**In Progress**, **Done** — with cards you move between them instantly, no page
reload. Built as a focused UI/UX + React demo: one core interaction (moving a
card between columns) executed two ways — a quick-action button and
drag-and-drop — with everything around it kept deliberately tight.

## Status

Under construction. See commit history for progress.

## Tech stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** — design tokens defined once, used as semantic classes
- **@dnd-kit** — accessible drag-and-drop
- **lucide-react** — icons

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```

## License

MIT
