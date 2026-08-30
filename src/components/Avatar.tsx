import { memberOf } from '../data/team'

interface AvatarProps {
  assigneeId: string
  size?: number
}

export function Avatar({ assigneeId, size = 22 }: AvatarProps) {
  const member = memberOf(assigneeId)
  return (
    <span
      title={member.name}
      style={{
        width: size,
        height: size,
        // blend the person's tint toward the current surface so it reads as a
        // hue hint in either theme, never a bright disc on dark charcoal
        backgroundColor: `color-mix(in oklab, ${member.tint} 42%, var(--color-surface))`,
        borderColor: `color-mix(in oklab, ${member.tint} 55%, var(--color-rule))`,
      }}
      className="inline-flex shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-medium text-ink select-none"
    >
      {member.initials}
    </span>
  )
}
