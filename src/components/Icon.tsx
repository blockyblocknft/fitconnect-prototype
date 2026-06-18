import * as Tabler from '@tabler/icons-react'

export function Icon({ name, size = 20, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const key = 'Icon' + name.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('')
  const Cmp = (Tabler as Record<string, React.ComponentType<{ size?: number; color?: string; stroke?: number }>>)[key]
  if (!Cmp) return null
  return <Cmp size={size} color={color} stroke={1.8} />
}
