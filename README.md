# Agency Task Board

### ▸ [View the live demo](https://amritvirk23av.github.io/agency-task-board/)

A single-screen operations board for a small agency: three columns — **To Do**,
**In Progress**, **Done** — with cards you move between them instantly, no page
reload. Built as a focused UI/UX + React demo: one core interaction (moving a
card between columns) executed two ways — a quick-action button and
drag-and-drop — with a tight set of supporting features around it.

The fictional client is **Meridian Studio**, an eight-person creative agency;
the board is seeded with a normal Tuesday's work across six client engagements.
Light and dark themes; a visitor's edits persist for the visit and reset for
the next one.

## Features

- **Three columns locked to one screen.** The page never scrolls on desktop —
  only the card lists inside each column do. Below the `md` breakpoint the
  columns stack and the page scrolls normally.
- **Move a card with one click.** Every card has a labelled step-forward control
  (`To Do → In Progress → Done`) and a step-back where it applies. The change
  runs inside a View Transition, so the card animates from its old slot to its
  new one and the rest reflow.
- **Or drag it.** `@dnd-kit` with pointer and keyboard sensors; drag between
  columns or reorder within one. The lifted card gets elevation and a slight
  tilt; the column under the cursor warms to the accent colour.
- **Add, edit, delete.** An inline composer at the foot of each column; click a
  card title to rename it in place; a small menu on each card re-sets priority
  or assignee, or deletes behind a two-step confirm.
- **Undo.** Moving or deleting raises a toast with an Undo action; `Ctrl/Cmd+Z`
  does the same while it is up.
- **Filter** the whole board by priority and assignee from the top bar.
- **Light and dark themes.** A warm charcoal, not pure black — the same design
  tokens, redefined. Follows the system setting; the toggle remembers a choice
  and is applied before first paint so there's no flash.
- **Per-visit persistence.** Edits are kept in `sessionStorage`, so they survive
  a refresh but every fresh visit starts from the clean sample set.
- Keyboard-navigable throughout, visible focus rings, `prefers-reduced-motion`
  honoured, screen-reader announcements for every board change.

## Tech stack

- **Vite + React + TypeScript** — no framework overhead a single-screen tool
  doesn't need
- **Tailwind CSS v4** — design tokens defined once in `src/index.css`, used as
  semantic utilities (`bg-paper`, `text-ink`, `border-rule`, …) rather than
  hardcoded values
- **@dnd-kit** — accessible drag-and-drop
- **lucide-react** — icons
- **View Transitions API** — the card-move choreography, with a plain fallback

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Deploying

The build is a static site with relative asset paths, so it runs at a domain
root or under a project path. A GitHub Actions workflow builds and publishes to
GitHub Pages on every push to `main` (`.github/workflows/deploy.yml`); the same
`dist` works unchanged on Vercel or Netlify.

## Project structure

```
src/
  App.tsx                 # composition root — owns board, filter, drag, and toast state
  components/
    BoardShell.tsx        # viewport-locked page shell; stacks below md
    TopBar.tsx            # brand, filters, theme toggle
    Meridian.tsx          # the hairline across the board with a coordinate dot per column
    Column.tsx            # droppable column; header, scroll area, composer
    TaskList.tsx          # SortableContext + the cards
    TaskCard.tsx          # card view + sortable wrapper; inline title edit, move controls
    CardMenu.tsx          # portalled panel: priority, assignee, delete
    TaskComposer.tsx      # inline "add task" form
    FilterBar.tsx         # priority + assignee selects
    ThemeToggle.tsx       # light / dark switch
    Toast.tsx             # single undo toast
  hooks/
    useBoard.ts           # useReducer + sessionStorage + a one-level undo snapshot
    useTheme.ts           # mirrors and toggles the .dark class
    useAnnounce.ts        # polite screen-reader announcement channel
  lib/
    board.ts              # pure board operations — move, reorder, add, edit, delete, filter
    storage.ts            # sessionStorage load/save with a shape guard
    motion.ts             # withViewTransition() helper
  data/
    seed.ts               # columns, sample tasks, storage key
    team.ts               # the studio roster behind the assignee avatars
  types.ts
```

## Design decisions

A few choices that weren't spelled out in the brief and are worth stating
rather than leaving implicit:

**"Move a card with a button" was the brief; drag-and-drop is additive.** The
request was specifically for *a quick action or button on the card*. That is
the primary path — it always works, it's keyboard-reachable, and it's what the
screen-reader flow is built around. Drag-and-drop is layered on top for people
who expect it, and the two are kept consistent: dragging a card to another
column drops it at the end, exactly where the step-forward button puts it.

**"Locks to a single screen" means the shell is fixed and the columns scroll.**
With three columns and an unknown number of cards, the only way to honour "no
page scroll" is to make the page shell exactly viewport-tall and give each
column its own overflow. Below a usable width that inverts — the columns stack
and the page scrolls — because a crushed three-column grid on a phone serves
nobody.

**The board keeps one level of undo, not a full history.** Undo here is tied to
the toast: it reverts the action the toast is describing. A move, then a
delete, leaves one live toast — undo it and you're back to the state before the
delete. This matches how the affordance reads ("undo *that*") without the
weight of a full undo stack the UI never surfaces.

**Persistence is per-visit, and there's no reset.** The board lives in
`sessionStorage`, so a reviewer's changes survive a refresh but the shared link
always opens on the clean sample set. That removes the need for a reset
control — which, on a public demo, is one accidental click from wiping the
board with nothing to restore it.

**Dark mode redefines the tokens, it doesn't add a second stylesheet.** Every
colour is a CSS custom property set once for light and again under `.dark`; the
components never name a colour. The theme class is written before first paint
by a tiny inline script, so there's no flash on load.

**Priority colour is never the only signal.** The pill is a coloured dot plus an
ink label. The dot carries conventional slate / amber / red so it's parsed at a
glance; the label stays readable regardless of colour vision.

**The card menu is portalled.** Each card sits inside a column with its own
`overflow`, which would clip a popover. The menu renders at the document root
with fixed positioning computed from its trigger, and dismisses on any scroll.

**One accent colour, spent on interaction only.** Everything structural is warm
paper, white, and hairline rules. The single pine accent is reserved for focus
rings, the primary button, the active drop target, and the coordinate that
pulses when a card lands — so those reads carry weight.

## License

MIT
