import type { TeamMember } from '../types'

/*
  Meridian Studio — an 8-person creative agency.
  Avatar tints are warm, low-saturation, and distinct enough to tell people
  apart down a column without shouting.
*/
export const TEAM: TeamMember[] = [
  { id: 'priya', name: 'Priya Kapoor', initials: 'PK', tint: '#e8ddcf' },
  { id: 'marcus', name: 'Marcus Lin', initials: 'ML', tint: '#d9e2d8' },
  { id: 'dana', name: 'Dana Osei', initials: 'DO', tint: '#e5dae0' },
  { id: 'sam', name: 'Sam Rourke', initials: 'SR', tint: '#d7e0e6' },
  { id: 'yuki', name: 'Yuki Tanaka', initials: 'YT', tint: '#ece1d2' },
  { id: 'elena', name: 'Elena Voss', initials: 'EV', tint: '#dfe0d3' },
  { id: 'theo', name: 'Theo Bright', initials: 'TB', tint: '#e3dccc' },
  { id: 'nadia', name: 'Nadia Rahman', initials: 'NR', tint: '#dcdde4' },
]

export const TEAM_BY_ID: Record<string, TeamMember> = Object.fromEntries(
  TEAM.map((member) => [member.id, member]),
)

export function memberOf(id: string): TeamMember {
  return TEAM_BY_ID[id] ?? TEAM[0]
}
