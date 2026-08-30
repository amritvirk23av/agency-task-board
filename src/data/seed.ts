import type { Column, Task } from '../types'

export const STORAGE_KEY = 'meridian.board.v1'

export const AGENCY = {
  name: 'Meridian Studio',
  boardName: 'Operations Board',
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', emptyLine: 'Nothing queued. Add the studio’s next task.' },
  {
    id: 'in-progress',
    title: 'In Progress',
    emptyLine: 'Nothing in flight right now.',
  },
  { id: 'done', title: 'Done', emptyLine: 'Finished work lands here.' },
]

export const COLUMN_ORDER = COLUMNS.map((column) => column.id)

/*
  A normal Tuesday at the studio: six live client engagements, work spread
  across the board. IDs are stable so a saved board upgrades cleanly.
*/
export const SEED_TASKS: Task[] = [
  // To Do
  { id: 't-01', title: 'Halcyon — landing page revisions, round 2', priority: 'high', assigneeId: 'priya', column: 'todo' },
  { id: 't-02', title: 'Northwind — Q3 report deck layout', priority: 'medium', assigneeId: 'dana', column: 'todo' },
  { id: 't-03', title: 'Vireo — content audit spreadsheet', priority: 'medium', assigneeId: 'nadia', column: 'todo' },
  { id: 't-04', title: 'Cedar & Co — favicon and app icon set', priority: 'low', assigneeId: 'yuki', column: 'todo' },
  { id: 't-05', title: 'Atlas Freight — sitemap for the new marketing site', priority: 'low', assigneeId: 'marcus', column: 'todo' },

  // In Progress
  { id: 't-06', title: 'Halcyon — build responsive nav and footer', priority: 'high', assigneeId: 'marcus', column: 'in-progress' },
  { id: 't-07', title: 'Bloom — brand guidelines PDF', priority: 'medium', assigneeId: 'elena', column: 'in-progress' },
  { id: 't-08', title: 'Northwind — animate the hero section', priority: 'low', assigneeId: 'theo', column: 'in-progress' },

  // Done
  { id: 't-09', title: 'Vireo — kickoff workshop deck', priority: 'high', assigneeId: 'priya', column: 'done' },
  { id: 't-10', title: 'Cedar & Co — logo lockup exploration', priority: 'medium', assigneeId: 'elena', column: 'done' },
  { id: 't-11', title: 'Halcyon — analytics and tag audit', priority: 'medium', assigneeId: 'sam', column: 'done' },
  { id: 't-12', title: 'Atlas Freight — competitor teardown', priority: 'low', assigneeId: 'dana', column: 'done' },
  { id: 't-13', title: 'Bloom — moodboard, round 1', priority: 'low', assigneeId: 'yuki', column: 'done' },
  { id: 't-14', title: 'Northwind — proofread the homepage copy', priority: 'low', assigneeId: 'nadia', column: 'done' },
]
