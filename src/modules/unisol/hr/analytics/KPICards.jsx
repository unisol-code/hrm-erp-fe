import React from "react";
import {
  Users,
  IndianRupee,
  Clock,
  Home,
  CreditCard,
  Award,
} from "lucide-react";

const KPICards = ({ empAnalyticsCards, theme }) => {
  const kpiSummary = [
    {
      id: 1,
      title: "Total Employees",
      value: empAnalyticsCards?.totalEmployees || 0,
      icon: Users,
      color: "blue",
    },
    {
      id: 2,
      title: "Avg Attendance",
      value: empAnalyticsCards?.avgAttendance || 0,
      icon: Clock,
      color: "green",
    },
    {
      id: 3,
      title: "Leaves Taken",
      value: empAnalyticsCards?.leavesTaken || 0,
      icon: Home,
      color: "orange",
    },
    {
      id: 4,
      title: "Total Expenses",
      value: empAnalyticsCards?.totalExpenses || 0,
      icon: CreditCard,
      color: "purple",
    },
    {
      id: 5,
      title: "Salary Loans",
      value: empAnalyticsCards?.totalLoans || 0,
      icon: IndianRupee,
      color: "red",
    },
    {
      id: 6,
      title: "Avg Appraisal",
      value: empAnalyticsCards?.avgAppraisalRating || 0,
      icon: Award,
      color: "indigo",
    }
  ];

  const colorMap = {
    blue: "#3B82F6",
    green: "#10B981",
    orange: "#F59E0B",
    purple: "#8B5CF6",
    red: "#EF4444",
    indigo: "#6366F1"
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiSummary.map((kpi) => {
        const Icon = kpi.icon;
        const color = colorMap[kpi.color] || theme.primaryColor;

        return (
          <div key={kpi.id} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                <Icon size={20} style={{ color }} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</div>
              <div className="text-sm font-medium text-gray-700">{kpi.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;