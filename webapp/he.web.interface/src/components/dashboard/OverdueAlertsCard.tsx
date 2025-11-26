import type { OverdueAlertsProps } from '@/types/dashboard';

export function OverdueAlertsCard({
  overdueOutreachCount,
  overdueFollowupCount,
  readmissionsNeedingReview,
  tcmOverdueCount,
  alerts,
  onViewAll,
  onAlertClick,
}: OverdueAlertsProps) {
  const totalOverdue = overdueOutreachCount + overdueFollowupCount + readmissionsNeedingReview + tcmOverdueCount;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'outreach':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'followup':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'readmission':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'tcm':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getAlertColor = (daysOverdue: number) => {
    if (daysOverdue >= 7) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (daysOverdue >= 3) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
  };

  if (totalOverdue === 0) {
    return (
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Overdue Alerts</h3>
          <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
            All Clear
          </span>
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[#888888] text-sm">No overdue items at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">

          {/* Badge-style summary stats */}
          {overdueOutreachCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs text-[#888888]">Outreach</span>
              <span className="text-sm font-bold text-red-400">{overdueOutreachCount}</span>
            </div>
          )}

          {overdueFollowupCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
              <svg className="w-3.5 h-3.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-[#888888]">Follow-ups</span>
              <span className="text-sm font-bold text-yellow-400">{overdueFollowupCount}</span>
            </div>
          )}

          {readmissionsNeedingReview > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs text-[#888888]">Readmissions</span>
              <span className="text-sm font-bold text-orange-400">{readmissionsNeedingReview}</span>
            </div>
          )}

          {tcmOverdueCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-[#888888]">TCM</span>
              <span className="text-sm font-bold text-red-400">{tcmOverdueCount}</span>
            </div>
          )}
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All
          </button>
        )}
      </div>

      {/* Alert List */}
      <div className="space-y-2 max-h-64 overflow-y-auto overflow-y-scroll scrollbar-hide">
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            className={`
              border rounded-lg p-3 transition-all cursor-pointer
              hover:shadow-md hover:scale-[1.01]
              ${getAlertColor(alert.daysOverdue)}
            `.trim()}
            onClick={() => onAlertClick?.(alert)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAlertClick?.(alert);
              }
            }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-white text-sm truncate">
                    {alert.patientName}
                  </p>
                  <span className="text-xs whitespace-nowrap">
                    {alert.daysOverdue}d overdue
                  </span>
                </div>
                <p className="text-xs text-[#888888] mt-1 line-clamp-1">
                  {alert.details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 5 && (
        <div className="mt-3 pt-3 border-t border-[#2A2A2A] text-center">
          <button
            onClick={onViewAll}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            +{alerts.length - 5} more alerts
          </button>
        </div>
      )}
    </div>
  );
}
