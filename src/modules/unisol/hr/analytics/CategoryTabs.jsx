import React from "react";
import {
  BarChart3,
  Clock,
  Home,
  CreditCard,
  DollarSign,
  Award,
  BookOpen,
} from "lucide-react";

const CategoryTabs = ({ activeCategory, setActiveCategory, theme }) => {
  const categoryTabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leaves", label: "Leaves", icon: Home },
    { id: "expenses", label: "Expenses", icon: CreditCard },
    { id: "loans", label: "Salary Loans", icon: DollarSign },
    { id: "appraisal", label: "Appraisal", icon: Award },
    // { id: "training", label: "Training", icon: BookOpen }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-3 px-11 py-3 text-base font-medium whitespace-nowrap transition-colors ${
                activeCategory === tab.id
                  ? 'border-b-2'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={activeCategory === tab.id ? {
                borderBottomColor: theme.primaryColor,
                color: theme.primaryColor
              } : {}}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;