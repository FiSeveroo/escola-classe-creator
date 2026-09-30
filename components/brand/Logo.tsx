import { cn } from '@/lib/utils'

export function Logo({ className, subtitle }: { className?: string; subtitle?: string }) {
  return (
    <div className={className}>
      <span className="font-display tracking-widest text-cc-green">
        CLASSE<span className="text-cc-white">CREATOR</span>
      </span>
      {subtitle && (
        <p className={cn('font-mono text-xs tracking-widest mt-0.5 text-muted-foreground')}>{subtitle}</p>
      )}
    </div>
  )
}
