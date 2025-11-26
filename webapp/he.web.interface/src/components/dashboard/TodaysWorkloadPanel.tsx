import type { TodaysWorkloadProps } from '@/types/dashboard';

export function TodaysWorkloadPanel({
  outreachDueToday,
  followupsDueToday,
  highRiskDischarges,
  tcmOverdue,
  onOutreachClick,
  onFollowupsClick,
  onHighRiskClick,
  onTcmOverdueClick,
}: TodaysWorkloadProps) {
  const workloadItems = [
    {
      label: 'Outreach Due Today',
      count: outreachDueToday,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'indigo',
      onClick: onOutreachClick,
    },
    {
      label: 'Follow-ups Due Today',
      count: followupsDueToday,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple',
      onClick: onFollowupsClick,
    },
    {
      label: 'High-Risk Discharges',
      count: highRiskDischarges,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'yellow',
      onClick: onHighRiskClick,
    },
    {
      label: 'TCM Overdue',
      count: tcmOverdue,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'red',
      onClick: onTcmOverdueClick,
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
      indigo: {
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        text: 'text-indigo-400',
        hover: 'hover:border-indigo-500/60 hover:bg-indigo-500/20',
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        hover: 'hover:border-purple-500/60 hover:bg-purple-500/20',
      },
      yellow: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        hover: 'hover:border-yellow-500/60 hover:bg-yellow-500/20',
      },
      red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        hover: 'hover:border-red-500/60 hover:bg-red-500/20',
      },
    };
    return colorMap[color];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workloadItems.map((item) => {
          const colors = getColorClasses(item.color);
          const isClickable = item.count > 0 && item.onClick;

          return (
            <div
              key={item.label}
              className={`
                ${colors.bg} ${colors.border} border rounded-lg p-4 transition-all
                ${isClickable ? `cursor-pointer ${colors.hover}` : 'opacity-60'}
              `.trim()}
              onClick={isClickable ? item.onClick : undefined}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  item.onClick?.();
                }
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={colors.text}>
                  {item.icon}
                </div>
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {item.count}
                </span>
              </div>
              <p className="text-sm text-[#E0E0E0] font-medium">{item.label}</p>
            </div>
          );
        })}
    </div>
  );
}
