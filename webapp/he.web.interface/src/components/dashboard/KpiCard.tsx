import type { KpiCardProps } from '@/types/dashboard';

export function KpiCard({
  title,
  value,
  icon,
  subtitle,
  trendDelta,
  trendLabel,
  onClick,
  tooltip,
  variant = 'default',
  isLoading = false,
}: KpiCardProps) {
  const variantStyles = {
    default: 'border-[#2A2A2A] hover:border-indigo-500/50',
    success: 'border-green-500/30 hover:border-green-500/50',
    warning: 'border-yellow-500/30 hover:border-yellow-500/50',
    danger: 'border-red-500/30 hover:border-red-500/50',
  };

  const cardClasses = `
    bg-[#1E1E1E] border rounded-lg p-6 transition-all
    ${variantStyles[variant]}
    ${onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02]' : ''}
  `.trim();

  const getTrendColor = () => {
    if (trendDelta === undefined) return '';
    return trendDelta >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getTrendIcon = () => {
    if (trendDelta === undefined) return null;
    return trendDelta >= 0 ? (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  };

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      title={tooltip}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#888888] mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-[#2A2A2A] animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
          )}
          {subtitle && (
            <p className="text-xs text-[#666666]">{subtitle}</p>
          )}
          {trendDelta !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="font-medium">
                {trendDelta > 0 ? '+' : ''}{trendDelta}%
              </span>
              {trendLabel && (
                <span className="text-[#666666] text-xs ml-1">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-indigo-400 opacity-70">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
