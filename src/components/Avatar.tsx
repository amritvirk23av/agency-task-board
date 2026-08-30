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
      style={{ width: size, height: size, backgroundColor: member.tint }}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium text-ink/80 select-none"
    >
      {member.initials}
    </span>
  )
}
