export interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trendDelta?: number;
  trendLabel?: string;
  onClick?: () => void;
  tooltip?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
}

export interface TodaysWorkloadProps {
  outreachDueToday: number;
  followupsDueToday: number;
  highRiskDischarges: number;
  tcmOverdue: number;
  onOutreachClick?: () => void;
  onFollowupsClick?: () => void;
  onHighRiskClick?: () => void;
  onTcmOverdueClick?: () => void;
}

export interface OverdueAlert {
  id: string;
  type: 'outreach' | 'followup' | 'readmission' | 'tcm';
  patientName: string;
  daysOverdue: number;
  details: string;
}

export interface OverdueAlertsProps {
  overdueOutreachCount: number;
  overdueFollowupCount: number;
  readmissionsNeedingReview: number;
  tcmOverdueCount: number;
  alerts: OverdueAlert[];
  onViewAll?: () => void;
  onAlertClick?: (alert: OverdueAlert) => void;
}

export interface MonthlyTrendItem {
  monthLabel: string;
  admissions: number;
  discharges: number;
  admissionsDelta?: number;
  dischargesDelta?: number;
}

export interface MonthlyTrendsChartProps {
  data: MonthlyTrendItem[];
  onMonthClick?: (month: string) => void;
  showPercentageChange?: boolean;
}

export interface TcmComplianceMetric {
  label: string;
  count: number;
  total: number;
  percentage: number;
  status: 'good' | 'warning' | 'danger';
}

export interface TcmComplianceCardProps {
  metrics: TcmComplianceMetric[];
  overallCompliance: number;
  onMetricClick?: (metric: TcmComplianceMetric) => void;
}

export interface EncounterTimelineItem {
  id: string;
  patientName: string;
  hospitalName: string;
  admissionDate: string;
  dischargeDate?: string;
  daysSinceDischarge?: number;
  status: 'active' | 'discharged-recent' | 'discharged-followup' | 'discharged-complete';
  tcmStatus?: 'pending' | 'in-progress' | 'completed' | 'overdue';
  nextAction?: string;
  encounterKey: string;
}

export interface EncounterTimelineProps {
  encounters: EncounterTimelineItem[];
  onEncounterClick?: (encounter: EncounterTimelineItem) => void;
  maxItems?: number;
}

export interface FeedHealthMetric {
  source: string;
  lastReceived: string;
  messagesLast24h: number;
  status: 'healthy' | 'warning' | 'error';
  errorCount?: number;
}

export interface FeedHealthCardProps {
  feeds: FeedHealthMetric[];
  onFeedClick?: (feed: FeedHealthMetric) => void;
  onViewDetails?: () => void;
}
