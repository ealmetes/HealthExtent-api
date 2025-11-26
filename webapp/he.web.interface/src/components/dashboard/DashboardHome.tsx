import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorAlert } from '../shared/ErrorAlert';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { getTenantMembers, type MemberHP } from '@/services/members-service';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { KpiCard } from './KpiCard';
import { TodaysWorkloadPanel } from './TodaysWorkloadPanel';
import { OverdueAlertsCard } from './OverdueAlertsCard';
import type { OverdueAlert } from '@/types/dashboard';


export function DashboardHome() {
  const { tenantKey } = useFirebaseAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<MemberHP[]>([]);

  // Accordion state - all panels open by default
  const [expandedPanels, setExpandedPanels] = useState({
    workload: true,
    alerts: true,
    metrics: true,
    charts: true,
    transitions: true,
  });

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  // Fetch care transitions for metrics
  const { data: careTransitions, isLoading: isLoadingCT, error: ctError } = useQuery({
    queryKey: ['care-transitions-all'],
    queryFn: () => apiClient.getCareTransitions({ page: 1, pageSize: 1000 }),
  });

  // Fetch TCM metrics
  const { data: tcmMetrics } = useQuery({
    queryKey: ['tcm-metrics'],
    queryFn: () => apiClient.getTCMMetrics(),
  });

  // Fetch encounters for monthly trends
  const { data: encounters, isLoading: isLoadingEnc } = useQuery({
    queryKey: ['encounters-all'],
    queryFn: () => apiClient.getEncounters({ page: 1, pageSize: 1000 }),
  });

  // Fetch team members for assigned user lookup
  useEffect(() => {
    if (!tenantKey) return;

    getTenantMembers(tenantKey).then(members => {
      setTeamMembers(members);
    }).catch(error => {
      console.error('Error fetching team members:', error);
    });
  }, [tenantKey]);

  // Calculate monthly trends
  const monthlyTrends = useMemo(() => {
    if (!encounters?.data) return [];

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        month: format(date, 'MMM yyyy'),
        start: startOfMonth(date),
        end: endOfMonth(date),
        admissions: 0,
        discharges: 0,
      };
    });

    encounters.data.forEach((enc) => {
      last6Months.forEach((month) => {
        if (enc.admissionDate) {
          const admitDate = parseISO(enc.admissionDate);
          if (admitDate >= month.start && admitDate <= month.end) {
            month.admissions++;
          }
        }
        if (enc.dischargeDate) {
          const dischargeDate = parseISO(enc.dischargeDate);
          if (dischargeDate >= month.start && dischargeDate <= month.end) {
            month.discharges++;
          }
        }
      });
    });

    return last6Months;
  }, [encounters?.data]);

  // Calculate max value for chart scaling
  const maxValue = Math.max(
    ...monthlyTrends.map((m) => Math.max(m.admissions, m.discharges)),
    1
  );

  // Calculate executive summary metrics
  const executiveMetrics = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Active encounters (Status = 1 or not discharged)
    const activeEncounters = encounters?.data?.filter(
      (enc) => !enc.dischargeDate || enc.dischargeDate === null
    ).length || 0;

    // Patients admitted this month
    const admittedThisMonth = encounters?.data?.filter((enc) => {
      if (!enc.admissionDate) return false;
      const admitDate = parseISO(enc.admissionDate);
      return admitDate >= startOfMonth && admitDate <= endOfMonth;
    }).length || 0;

    // Patients discharged this month
    const dischargedThisMonth = encounters?.data?.filter((enc) => {
      if (!enc.dischargeDate) return false;
      const dischargeDate = parseISO(enc.dischargeDate);
      return dischargeDate >= startOfMonth && dischargeDate <= endOfMonth;
    }).length || 0;

    // Average length of stay
    const completedStays = encounters?.data?.filter(
      (enc) => enc.admissionDate && enc.dischargeDate
    ) || [];
    const avgLOS = completedStays.length > 0
      ? completedStays.reduce((sum, enc) => {
          const admit = parseISO(enc.admissionDate!);
          const discharge = parseISO(enc.dischargeDate!);
          return sum + Math.ceil((discharge.getTime() - admit.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / completedStays.length
      : 0;

    // Active care transitions
    const activeCareTransitions = careTransitions?.data?.filter(
      (ct) => ct.status === 'Open' || ct.status === 'InProgress'
    ).length || 0;

    // Pending follow-ups (future next outreach dates)
    const pendingFollowUps = careTransitions?.data?.filter((ct) => {
      if (!ct.nextOutreachDate) return false;
      return parseISO(ct.nextOutreachDate) > now;
    }).length || 0;

    // 30-day readmission rate - based on readmitted encounters in last 30 days
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Count encounters discharged in the last 30 days
    const dischargedLast30Days = encounters?.data?.filter((enc) => {
      if (!enc.dischargeDate) return false;
      const dischargeDate = parseISO(enc.dischargeDate);
      return dischargeDate >= thirtyDaysAgo && dischargeDate <= now;
    }).length || 0;

    // Count readmitted encounters in the last 30 days
    const readmittedLast30Days = encounters?.data?.filter((enc) => {
      const isReadmitted = enc.visitStatus?.toUpperCase() === 'READMITTED' || enc.visitStatus?.toUpperCase() === 'R';
      if (!isReadmitted || !enc.admissionDate) return false;
      const admitDate = parseISO(enc.admissionDate);
      return admitDate >= thirtyDaysAgo && admitDate <= now;
    }).length || 0;

    // Calculate readmission rate as percentage
    const readmissionRate = dischargedLast30Days > 0
      ? Math.round((readmittedLast30Days / dischargedLast30Days) * 100)
      : 0;

    return {
      activeEncounters,
      admittedThisMonth,
      dischargedThisMonth,
      avgLOS,
      activeCareTransitions,
      pendingFollowUps,
      readmissionRate,
    };
  }, [encounters?.data, careTransitions?.data]);

  // Calculate care transition metrics
  const ctMetrics = useMemo(() => {
    if (!careTransitions?.data) {
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
        overdue: 0,
      };
    }

    const now = new Date();
    return {
      total: careTransitions.data.length,
      open: careTransitions.data.filter((ct) => ct.status === 'Open').length,
      inProgress: careTransitions.data.filter((ct) => ct.status === 'InProgress').length,
      closed: careTransitions.data.filter((ct) => ct.status === 'Closed').length,
      highRisk: careTransitions.data.filter((ct) => ct.riskTier === 'High').length,
      mediumRisk: careTransitions.data.filter((ct) => ct.riskTier === 'Medium').length,
      lowRisk: careTransitions.data.filter((ct) => ct.riskTier === 'Low').length,
      overdue: careTransitions.data.filter((ct) => {
        if (!ct.nextOutreachDate) return false;
        return parseISO(ct.nextOutreachDate) < now && ct.status !== 'Closed';
      }).length,
    };
  }, [careTransitions?.data]);

  // Helper function to get assigned user name
  const getAssignedUserName = (ct: any): string | null => {
    // First check if assignedTo.name is present
    if (ct.assignedTo?.name) {
      return ct.assignedTo.name;
    }

    // Then try to lookup by assignedToUserKey
    if (ct.assignedToUserKey && teamMembers.length > 0) {
      // First try to find by userId
      let member = teamMembers.find((m: MemberHP) => m.userId === ct.assignedToUserKey);

      // If not found, try to find by memberDocId
      if (!member) {
        member = teamMembers.find((m: MemberHP) => m.memberDocId === ct.assignedToUserKey);
      }

      if (member) {
        // Build full name from firstName and lastName
        const fullName = [member.firstName, member.lastName]
          .filter(n => n && n.trim())
          .join(' ');

        if (fullName) {
          return fullName;
        }

        // Fallback to email if name not available
        return member.email || 'Unknown User';
      }
    }

    return null;
  };

  // Calculate compliance percentages
  const tcmComplianceRate = tcmMetrics && tcmMetrics.tcmContactWithin2Days !== undefined && tcmMetrics.totalOpen !== undefined && tcmMetrics.totalInProgress !== undefined
    ? Math.round((tcmMetrics.tcmContactWithin2Days / Math.max(tcmMetrics.totalOpen + tcmMetrics.totalInProgress, 1)) * 100)
    : 0;

  const followUpRate = tcmMetrics && tcmMetrics.followUpWithin14Days !== undefined && tcmMetrics.totalOpen !== undefined && tcmMetrics.totalInProgress !== undefined
    ? Math.round((tcmMetrics.followUpWithin14Days / Math.max(tcmMetrics.totalOpen + tcmMetrics.totalInProgress, 1)) * 100)
    : 0;

  // Calculate today's workload metrics
  const todaysWorkload = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Outreach due today
    const outreachDueToday = careTransitions?.data?.filter((ct) => {
      if (!ct.nextOutreachDate || ct.status === 'Closed') return false;
      const outreachDate = parseISO(ct.nextOutreachDate);
      return outreachDate >= today && outreachDate < tomorrow;
    }).length || 0;

    // Follow-ups due today (encounters discharged 7-14 days ago)
    const followupsDueToday = encounters?.data?.filter((enc) => {
      const dischargeDate = enc.dischargeDateTime || enc.dischargeDate;
      if (!dischargeDate) return false;
      const discharge = parseISO(dischargeDate);
      const daysSinceDischarge = Math.floor((now.getTime() - discharge.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceDischarge >= 7 && daysSinceDischarge <= 14;
    }).length || 0;

    // High-risk discharges (discharged in last 48 hours)
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    const highRiskDischarges = encounters?.data?.filter((enc) => {
      const dischargeDate = enc.dischargeDateTime || enc.dischargeDate;
      if (!dischargeDate) return false;
      const discharge = parseISO(dischargeDate);
      return discharge >= twoDaysAgo && discharge <= now;
    }).length || 0;

    // TCM overdue (missed 2-day contact window)
    const tcmOverdue = careTransitions?.data?.filter((ct) => {
      if (ct.status === 'Closed') return false;
      const dischargeDate = ct.encounter?.dischargeDateTime || ct.dischargeDateTime;
      if (!dischargeDate) return false;
      const discharge = parseISO(dischargeDate);
      const daysSinceDischarge = Math.floor((now.getTime() - discharge.getTime()) / (1000 * 60 * 60 * 24));
      // Check if more than 2 days since discharge and no outreach logged yet
      return daysSinceDischarge > 2 && !ct.outreachDate;
    }).length || 0;

    return {
      outreachDueToday,
      followupsDueToday,
      highRiskDischarges,
      tcmOverdue,
    };
  }, [careTransitions?.data, encounters?.data]);

  // Calculate overdue alerts
  const overdueAlerts = useMemo(() => {
    const now = new Date();
    const alerts: OverdueAlert[] = [];

    // Helper function to get patient name safely (using same pattern as Recent Care Transitions table)
    const getPatientName = (item: any): string => {
      // Use the exact same pattern that works in the Recent Care Transitions table
      const patientKey = item.patientKey || item.PatientKey;
      const patientName = item.patient.firstName + " " + item.patient.lastName
      return patientName || (patientKey ? `Patient ${patientKey}` : 'Unknown Patient');
    };

    // Helper function to generate unique alert ID even when key is undefined
    const generateUniqueId = (type: string, key: string | undefined, patientKey: string | undefined, index: number): string => {
      if (key) return `${type}-${key}`;
      // Fallback: use patientKey + index to ensure uniqueness
      const fallbackKey = patientKey || `unknown-${index}`;
      return `${type}-${fallbackKey}-${index}`;
    };

    // Overdue outreach
    const overdueOutreach = careTransitions?.data?.filter((ct) => {
      if (!ct.nextOutreachDate || ct.status === 'Closed') return false;
      return parseISO(ct.nextOutreachDate) < now;
    }) || [];

    overdueOutreach.forEach((ct, index) => {
      const outreachDate = parseISO(ct.nextOutreachDate!);
      const daysOverdue = Math.floor((now.getTime() - outreachDate.getTime()) / (1000 * 60 * 60 * 24));

      alerts.push({
        id: generateUniqueId('outreach', ct.careTransitionKey, ct.patientKey, index),
        type: 'outreach',
        patientName: getPatientName(ct),
        daysOverdue,
        details: `Outreach was due ${format(outreachDate, 'MMM dd, yyyy')}`,
      });
    });

    // Overdue follow-ups (>14 days since discharge)
    const overdueFollowups = encounters?.data?.filter((enc) => {
      const dischargeDate = enc.dischargeDateTime || enc.dischargeDate;
      if (!dischargeDate) return false;
      const discharge = parseISO(dischargeDate);
      const daysSinceDischarge = Math.floor((now.getTime() - discharge.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceDischarge > 14;
    }) || [];

    overdueFollowups.forEach((enc, index) => {
      const dischargeDateStr = enc.dischargeDateTime || enc.dischargeDate;
      const dischargeDate = parseISO(dischargeDateStr!);
      const daysOverdue = Math.floor((now.getTime() - dischargeDate.getTime()) / (1000 * 60 * 60 * 24)) - 14;
      alerts.push({
        id: generateUniqueId('followup', enc.encounterKey, enc.patientKey, index),
        type: 'followup',
        patientName: getPatientName(enc),
        daysOverdue,
        details: `Discharged ${format(dischargeDate, 'MMM dd, yyyy')}`,
      });
    });

    // Readmissions needing review
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const readmissions = encounters?.data?.filter((enc) => {
      const isReadmitted = enc.visitStatus?.toUpperCase() === 'READMITTED' || enc.visitStatus?.toUpperCase() === 'R';
      const admissionDate = enc.admitDateTime || enc.admissionDate;
      if (!isReadmitted || !admissionDate) return false;
      const admitDate = parseISO(admissionDate);
      return admitDate >= thirtyDaysAgo && admitDate <= now;
    }) || [];

    readmissions.forEach((enc, index) => {
      const admissionDateStr = enc.admitDateTime || enc.admissionDate;
      const admitDate = parseISO(admissionDateStr!);
      const daysAgo = Math.floor((now.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24));
      alerts.push({
        id: generateUniqueId('readmission', enc.encounterKey, enc.patientKey, index),
        type: 'readmission',
        patientName: getPatientName(enc),
        daysOverdue: daysAgo,
        details: `Readmitted ${format(admitDate, 'MMM dd, yyyy')}`,
      });
    });

    // Sort by days overdue (most urgent first)
    return alerts.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [careTransitions?.data, encounters?.data]);

  if (isLoadingCT || isLoadingEnc) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-[#888888]">
          Care Management Performance Overview
        </p>
      </div>

      {/* Today's Workload Panel */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <button
          onClick={() => togglePanel('workload')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#252525] transition-colors"
        >
          <h3 className="text-lg font-semibold text-white">Today's Workload</h3>
          <svg
            className={`w-5 h-5 text-[#888888] transition-transform ${expandedPanels.workload ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedPanels.workload && (
          <div className="px-6 pb-6">
            <TodaysWorkloadPanel
              outreachDueToday={todaysWorkload.outreachDueToday}
              followupsDueToday={todaysWorkload.followupsDueToday}
              highRiskDischarges={todaysWorkload.highRiskDischarges}
              tcmOverdue={todaysWorkload.tcmOverdue}
              onOutreachClick={() => navigate('/app/care-transitions?filter=outreach-due')}
              onFollowupsClick={() => navigate('/app/care-transitions?filter=followup-due')}
              onHighRiskClick={() => navigate('/app/discharge-summaries?filter=high-risk')}
              onTcmOverdueClick={() => navigate('/app/care-transitions?filter=tcm-overdue')}
            />
          </div>
        )}
      </div>

      {/* Overdue Alerts */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <button
          onClick={() => togglePanel('alerts')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#252525] transition-colors"
        >
          <h3 className="text-lg font-semibold text-white">Overdue Alerts</h3>
          <svg
            className={`w-5 h-5 text-[#888888] transition-transform ${expandedPanels.alerts ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedPanels.alerts && (
          <div className="p-6 pt-0">
            <OverdueAlertsCard
              overdueOutreachCount={overdueAlerts.filter(a => a.type === 'outreach').length}
              overdueFollowupCount={overdueAlerts.filter(a => a.type === 'followup').length}
              readmissionsNeedingReview={overdueAlerts.filter(a => a.type === 'readmission').length}
              tcmOverdueCount={overdueAlerts.filter(a => a.type === 'tcm').length}
              alerts={overdueAlerts}
              onViewAll={() => navigate('/app/care-transitions?filter=overdue')}
              onAlertClick={(alert) => {
                // Extract the key from alert ID
                const idParts = alert.id.split('-');
                const key = idParts[1];

                // Only navigate if we have a valid key (not a fallback ID)
                if (!key || key === 'unknown' || idParts.length > 2) {
                  console.warn('Cannot navigate: Invalid or missing record key for alert', alert);
                  return;
                }

                if (alert.type === 'outreach' || alert.type === 'tcm') {
                  navigate(`/app/care-transitions/${key}`);
                } else if (alert.type === 'followup' || alert.type === 'readmission') {
                  navigate(`/app/discharge-summaries/${key}`);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Executive Summary - Top Metrics */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <button
          onClick={() => togglePanel('metrics')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#252525] transition-colors"
        >
          <h3 className="text-lg font-semibold text-white">Key Metrics</h3>
          <svg
            className={`w-5 h-5 text-[#888888] transition-transform ${expandedPanels.metrics ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedPanels.metrics && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6">
        <KpiCard
          title="Active Encounters"
          value={executiveMetrics.activeEncounters}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          onClick={() => navigate('/app/discharge-summaries')}
          tooltip="Click to view all encounters"
        />

                <KpiCard
          title="Active Care Transitions"
          value={executiveMetrics.activeCareTransitions}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          onClick={() => navigate('/app/care-transitions')}
          tooltip="Click to view all care transitions"
        />

        <KpiCard
          title="Admitted (Month)"
          value={executiveMetrics.admittedThisMonth}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
          onClick={() => navigate('/app/discharge-summaries?filter=admitted-this-month')}
          variant="success"
          tooltip="Patients admitted this month"
        />

        <KpiCard
          title="Discharged (Month)"
          value={executiveMetrics.dischargedThisMonth}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          }
          onClick={() => navigate('/app/discharge-summaries?filter=discharged-this-month')}
          tooltip="Patients discharged this month"
        />




        <KpiCard
          title="Avg Length of Stay"
          value={`${executiveMetrics.avgLOS.toFixed(1)} days`}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          tooltip="Average length of stay for completed encounters"
        />
        <KpiCard
          title="Pending Follow-Ups"
          value={executiveMetrics.pendingFollowUps}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          onClick={() => navigate('/app/care-transitions?filter=pending-followups')}
          variant="warning"
          tooltip="Scheduled follow-ups"
        />

        {/* <KpiCard
          title="30-Day Readmission Rate"
          value={`${executiveMetrics.readmissionRate}%`}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
          onClick={() => navigate('/app/discharge-summaries?visitStatus=Readmitted')}
          variant={executiveMetrics.readmissionRate > 15 ? 'danger' : executiveMetrics.readmissionRate > 10 ? 'warning' : 'default'}
          tooltip="Click to view readmitted patients"
        /> */}
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <button
          onClick={() => togglePanel('charts')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#252525] transition-colors"
        >
          <h3 className="text-lg font-semibold text-white">Charts & Analytics</h3>
          <svg
            className={`w-5 h-5 text-[#888888] transition-transform ${expandedPanels.charts ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedPanels.charts && (
          <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Admissions & Discharges */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Monthly Trends</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-[#888888]">Admissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-800"></div>
                <span className="text-[#888888]">Discharges</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {monthlyTrends.map((month, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#E0E0E0] font-medium">{month.month}</span>
                  <span className="text-[#888888]">
                    {month.admissions} / {month.discharges}
                  </span>
                </div>
                <div className="relative h-4 bg-[#0A0A0A] rounded-lg overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg transition-all"
                    style={{ width: `${(month.admissions / maxValue) * 100}%` }}
                  ></div>
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-800 to-purple-600 rounded-lg transition-all"
                    style={{ width: `${(month.discharges / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TCM Compliance & Risk Distribution */}
        <div className="space-y-6">
          {/* TCM Compliance Metrics */}
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}>
            <h3 className="text-lg font-semibold text-white mb-6">TCM Compliance</h3>
            <div className="space-y-6">
              {/* Pie Chart */}
              <div className="flex items-center justify-center">
                <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
                  {/* 2-Day Contact Rate segment - GREEN */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="40"
                    strokeDasharray={`${(tcmComplianceRate / 100) * 439.6} 439.6`}
                    className="transition-all duration-500"
                  />
                  {/* 14-Day Follow-up Rate segment - YELLOW */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="40"
                    strokeDasharray={`${(followUpRate / 100) * 439.6} 439.6`}
                    strokeDashoffset={`-${(tcmComplianceRate / 100) * 439.6}`}
                    className="transition-all duration-500"
                  />
                  {/* Center circle for donut effect */}
                  <circle cx="90" cy="90" r="50" fill="#1E1E1E" />
                  {/* Center text */}
                  <text x="90" y="85" textAnchor="middle" className="fill-white text-2xl font-bold transform rotate-90" style={{ transformOrigin: '90px 90px' }}>
                    {Math.round((tcmComplianceRate + followUpRate) / 2)}%
                  </text>
                  <text x="90" y="102" textAnchor="middle" className="fill-[#888888] text-xs transform rotate-90" style={{ transformOrigin: '90px 90px' }}>
                    Avg
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-[#E0E0E0]">2-Day Contact</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{tcmComplianceRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-[#E0E0E0]">14-Day Follow-up</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{followUpRate}%</span>
                </div>
              </div>

              {/* Avg Outreach Attempts */}
              <div className="pt-3 border-t border-[#2A2A2A]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888888]">Avg Outreach Attempts</span>
                  <span className="text-lg font-semibold text-white">
                    {tcmMetrics?.avgOutreachAttempts?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          </div>
        )}
      </div>

      {/* Recent Care Transitions */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <button
          onClick={() => togglePanel('transitions')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#252525] transition-colors"
        >
          <h3 className="text-lg font-semibold text-white">Recent Care Transitions</h3>
          <div className="flex items-center gap-3">
            <Link
              to="/app/care-transitions"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View all →
            </Link>
            <svg
              className={`w-5 h-5 text-[#888888] transition-transform ${expandedPanels.transitions ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {expandedPanels.transitions && (
        <div>
          {(() => {
            // Filter out closed care transitions
            const activeCareTransitions = careTransitions?.data?.filter(ct => ct.status !== 'Closed') || [];

            if (activeCareTransitions.length === 0) {
              return (
                <div className="p-8 text-center text-[#888888]">
                  No active care transitions found
                </div>
              );
            }

            return (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2A2A2A]">
                  <thead className="bg-[#0A0A0A]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider">
                        Risk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider">
                        Next Outreach
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider">
                        Assigned To
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1E1E1E] divide-y divide-[#2A2A2A]">
                    {activeCareTransitions.slice(0, 10).map((ct) => {
                    const patientName = ct.patient?.name || ct.patient?.patientName || `Patient ${ct.patientKey}`;
                    const dob = ct.patient?.dob ? new Date(ct.patient.dob).toLocaleDateString() : 'N/A';

                    return (
                      <tr key={ct.careTransitionKey} 
                      onClick={() => navigate(`/app/care-transitions/${ct.careTransitionKey}`)}
                      className="hover:bg-[#252525] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/app/care-transitions/${ct.careTransitionKey}`}
                            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                          >
                            {patientName}
                          </Link>
                          <div className="text-xs text-[#888888]">
                            DOB: {dob} 
                          </div>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ct.status === 'Open'
                              ? 'bg-blue-500/20 text-blue-400'
                              : ct.status === 'InProgress'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {ct.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ct.riskTier === 'High'
                              ? 'bg-red-500/20 text-red-400'
                              : ct.riskTier === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {ct.riskTier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E0E0E0]">
                        {ct.nextOutreachDate ? format(parseISO(ct.nextOutreachDate), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E0E0E0]">
                        {getAssignedUserName(ct) || 'Unassigned'}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            );
          })()}
        </div>
        )}
      </div>
    </div>
  );
}
