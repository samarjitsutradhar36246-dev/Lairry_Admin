import KpiCard from "../components/dashboard/KpiCard";
import InstituteLocationMap from "../components/dashboard/InstituteLocationMap";
import RecentLoginCard from "../components/dashboard/RecentLoginCard";
import RecentlyActivatedInstitutesAccount from "../components/dashboard/RecentlyActivatedInstitutesAccount";
import GrowthAnalyticsSection from "../components/dashboard/growthAnalyticsSection/GrowthAnalyticsSection";
import FinancialSection from "../components/dashboard/financialSection/FinancialSection";
import InstitutesSection from "../components/dashboard/instituteSection/InstitutesSection";
import StudentsSection from "../components/dashboard/studentsSection/StudentsSection";
import AiIntelligenceSection from "../components/dashboard/aiIntelligenceSection/AiIntelligenceSection";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase/SupabaseClient";
import Card from "../theme/Card";
import LazySection from "../components/dashboard/LazySection";
import TestPaperOverview from "../../testPapers/TestPaperOverview";

const AdminDashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [deltaPeriod, setDeltaPeriod] = useState(1);
  const [dataReady, setDataReady] = useState(false);
  const [kpiData, setKpiData] = useState({
    totalStudents: 0,
    studentsCompletedSetup: 0,
    totalInstitutes: 0,
    activeInstitutes: 0,
    examListed: 0,
    delta: {},
    timestamp: null,
  });

  const fetchKpis = useCallback(
    async (isInitial = false) => {
      if (isInitial) setDataReady(false); // ← reset on each new fetch
      const today = new Date().toISOString().split("T")[0];

      const { data: kpiTotals } = await supabase
        .from("kpi_totals")
        .select("*")
        .eq("id", 1)
        .single();

      const currentKpis = {
        totalStudents: kpiTotals.total_students,
        enrolledStudents: kpiTotals.enrolled_students,
        totalInstitutes: kpiTotals.total_institutes,
        activeInstitutes: kpiTotals.active_institutes,
        examListed: kpiTotals.exam_listed,
      };

      const baselineDate = new Date();
      baselineDate.setDate(baselineDate.getDate() - deltaPeriod);
      const bDateStr = baselineDate.toISOString().split("T")[0];

      const { data: baselineSnapshot } = await supabase
        .from("kpi_history_snapshots")
        .select(
          "total_students, enrolled_students, total_institutes, active_institutes, exam_listed",
        )
        .gte("created_at", `${bDateStr}T00:00:00`)
        .lt("created_at", `${bDateStr}T23:59:59`)
        .maybeSingle();

      const baseline = baselineSnapshot || { ...currentKpis };

      const { data: todaySnapshot } = await supabase
        .from("kpi_history_snapshots")
        .select("id")
        .gte("created_at", `${today}T00:00:00`)
        .lt("created_at", `${today}T23:59:59`)
        .limit(1);

      if (!todaySnapshot || todaySnapshot.length === 0) {
        await supabase.from("kpi_history_snapshots").insert([
          {
            total_students: currentKpis.totalStudents,
            enrolled_students: currentKpis.enrolledStudents,
            total_institutes: currentKpis.totalInstitutes,
            active_institutes: currentKpis.activeInstitutes,
            exam_listed: currentKpis.examListed,
          },
        ]);
      }

      const safeDelta = (current, last) => {
        if (!last) return current === 0 ? 0 : current * 100;
        return (((current - last) / last) * 100).toFixed(2);
      };

      const formatDelta = (val) => (val > 0 ? "+" : "") + val + "%";

      const delta = {
        totalStudents: formatDelta(
          safeDelta(currentKpis.totalStudents, baseline.total_students),
        ),
        enrolledStudents: formatDelta(
          safeDelta(currentKpis.enrolledStudents, baseline.enrolled_students),
        ),
        totalInstitutes: formatDelta(
          safeDelta(currentKpis.totalInstitutes, baseline.total_institutes),
        ),
        activeInstitutes: formatDelta(
          safeDelta(currentKpis.activeInstitutes, baseline.active_institutes),
        ),
        examListed: formatDelta(
          safeDelta(currentKpis.examListed, baseline.exam_listed),
        ),
      };

      // setKpiData normally — no setState inside setState
      setKpiData({
        ...currentKpis,
        delta,
        timestamp: new Date().toISOString(),
      });
      setDataReady(true); // ← fires AFTER data is set, triggers scroll restore
    },
    [deltaPeriod],
  ); // ← dataReady NOT in deps, prevents loop

  useEffect(() => {
    const fetch = async () => {
      try {
        const isFirst = !dataReady; // first time = dataReady is still false
        await fetchKpis(isFirst);
      } catch (err) {
        console.error("Error fetching KPIs:", err);
      }
    };
    fetch();
  }, [fetchKpis]); // ← fetchKpis only changes when deltaPeriod changes

  if (!dataReady) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
        {/* ↓ make these taller to match real section heights */}
        <div className="h-[400px] rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-[400px] rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-[400px] rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative flex items-start md:items-center justify-between gap-2">
        <div className="flex-shrink-0">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
            Total KPIs
          </h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400">
            Overview of key metrics
          </p>
        </div>

        <div
          id="tour-delta-dropdown"
          className="relative inline-block text-left flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
            <span className="text-xs md:text-sm text-gray-600 dark:text-slate-400 whitespace-nowrap">
              Growth % VS :
            </span>
            <button
              type="button"
              className="inline-flex justify-between w-32 md:w-40 px-3 md:px-4 py-2 
                bg-gray-100 dark:bg-slate-700 
                text-gray-900 dark:text-white 
                text-xs md:text-sm font-medium rounded-lg 
                shadow-sm dark:shadow 
                hover:bg-gray-200 dark:hover:bg-slate-600 
                focus:outline-none focus:ring-2 focus:ring-cyan-500
                border border-gray-300 dark:border-transparent
                transition-colors duration-200"
              onClick={() => setShowDropdown(!showDropdown)}>
              <span className="truncate">
                {deltaPeriod === 1
                  ? "Yesterday"
                  : deltaPeriod === 7
                    ? "Last 7 Days"
                    : "Last 30 Days"}
              </span>
              <svg
                className="-mr-1 ml-1 md:ml-2 h-4 md:h-5 w-4 md:w-5 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {showDropdown && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-32 md:w-40 rounded-md 
              shadow-lg bg-white dark:bg-slate-800 
              ring-1 ring-black ring-opacity-5 
              border border-gray-200 dark:border-gray-700
              focus:outline-none z-50">
              <div className="py-1">
                {[1, 7, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => {
                      setDeltaPeriod(days);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm 
                      text-gray-900 dark:text-white 
                      hover:bg-gray-100 dark:hover:bg-slate-700
                      transition-colors duration-150">
                    {days === 1 ? "Yesterday" : `Last ${days} Days`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div id="tour-kpi-row-1" className="md:grid md:grid-cols-4 md:gap-6">
        <div className="flex flex-col gap-4 md:contents">
          <div>
            <KpiCard
              title="Total Students"
              value={kpiData.totalStudents}
              delta={`${kpiData.delta?.totalStudents || 0}`}
              color="cyan"
            />
          </div>
          <div>
            <KpiCard
              title="Enrolled Students"
              value={kpiData.enrolledStudents}
              delta={`${kpiData.delta?.enrolledStudents || 0}`}
              color="blue"
            />
          </div>
          <div>
            <KpiCard
              title="Total Institutes"
              value={kpiData.totalInstitutes}
              delta={`${kpiData.delta?.totalInstitutes || 0}`}
              color="yellow"
            />
          </div>
          <div>
            <KpiCard
              title="Active Institutes"
              value={kpiData.activeInstitutes}
              delta={`${kpiData.delta?.activeInstitutes || 0}`}
              color="green"
            />
          </div>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div id="tour-map" className="lg:col-span-2">
          <Card>
            <InstituteLocationMap mode="preview" />
          </Card>
        </div>
        <div id="tour-recent-activity" className="flex flex-col gap-6">
          <RecentLoginCard />
          <RecentlyActivatedInstitutesAccount />
        </div>
      </div>

      {/* Additional Sections */}
      {/* <div className="mt-10">
        <RevenueSection mode="preview" />
      </div> */}
      <div id="tour-financial" className="mt-12">
        <LazySection fallbackHeight="400px">
          <FinancialSection mode="preview" />
        </LazySection>
      </div>
      {/* <div className="mt-12">
        <AiIntelligenceSection mode="preview" />
      </div> */}
      <div id="tour-students-preview" className="mt-12">
        <LazySection fallbackHeight="400px">
          <StudentsSection mode="preview" />
        </LazySection>
      </div>
      <div id="tour-institutes-preview" className="mt-12">
        <LazySection fallbackHeight="400px">
          <InstitutesSection mode="preview" />
        </LazySection>
      </div>
      <div id="tour-test-papers" className="mt-12">
        <LazySection fallbackHeight="400px">
          <TestPaperOverview />
        </LazySection>
      </div>
    </div>
  );
};

export default AdminDashboard;
