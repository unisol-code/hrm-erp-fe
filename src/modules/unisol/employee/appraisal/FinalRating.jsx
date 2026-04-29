import React, { useEffect, useState } from 'react';
import BreadCrumb from '../../../../components/BreadCrumb';
import useExpAppraisal from '../../../../hooks/unisol/empAppraisal/useExpAppraisal';
import Select from "react-select";
import { useTheme } from '../../../../hooks/theme/useTheme';
import LoaderSpinner from '../../../../components/LoaderSpinner';
import { FaStar, FaChartLine, FaRegClock, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const FinalRating = () => {
    const { fetchEmpLeadershipAppraisalYear, leadershipAppraisalYear, fetchFinalRating, finalRating, loading } = useExpAppraisal();
    const { theme } = useTheme();
    
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedCycle, setSelectedCycle] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        fetchEmpLeadershipAppraisalYear();
    }, []);

    const handleSearch = () => {
        if (selectedYear && selectedCycle) {
            setHasSearched(true);
            const params = {
                year: selectedYear,
                cycle1: selectedCycle === "cycle1" ? true : undefined,
                cycle2: selectedCycle === "cycle2" ? true : undefined
            };
            fetchFinalRating(params);
        }
    };

    const handleReset = () => {
        setSelectedYear(null);
        setSelectedCycle(null);
        setHasSearched(false);
    };


    console.log("Final Rating Data:", finalRating);

    const yearOptions = leadershipAppraisalYear?.map((year) => ({
        value: year,
        label: year.toString(),
    })) || [];

    const cycleOptions = [
        { value: "cycle1", label: "Cycle 1 (Jan-Jun)" },
        { value: "cycle2", label: "Cycle 2 (Jul-Dec)" },
    ];

    // Check if search button should be enabled
    const isSearchEnabled = selectedYear && selectedCycle;

    return (
        <div className="min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: "Appraisal", href: "/emp/appraisal" },
                    { text: "Final Rating" },
                ]}
            />

            <div className="pb-8">
                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: theme?.primaryColor }}></div>
                        Select Filters to View Final Rating
                    </h2>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        {/* Year Select */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Select Year
                            </label>
                            <Select
                                options={yearOptions}
                                value={yearOptions.find(opt => opt.value === selectedYear)}
                                onChange={(option) => setSelectedYear(option ? option.value : null)}
                                placeholder="Choose Year"
                                isClearable
                                menuPortalTarget={document.body}
                                styles={{
                                    container: (base) => ({ ...base, width: '100%' }),
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    control: (base) => ({
                                        ...base,
                                        borderColor: theme?.secondaryColor,
                                        borderRadius: '0.75rem',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: theme?.primaryColor,
                                            boxShadow: `0 0 0 2px ${theme?.primaryColor}20`
                                        }
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected ? theme?.primaryColor : state.isFocused ? `${theme?.primaryColor}20` : 'white',
                                        color: state.isSelected ? 'white' : 'inherit',
                                    })
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary: theme?.primaryColor,
                                        primary25: `${theme?.primaryColor}20`,
                                    },
                                })}
                            />
                        </div>

                        {/* Cycle Select */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Select Cycle Period
                            </label>
                            <Select
                                options={cycleOptions}
                                value={cycleOptions.find(opt => opt.value === selectedCycle)}
                                onChange={(option) => setSelectedCycle(option ? option.value : null)}
                                placeholder="Choose Cycle"
                                isClearable
                                menuPortalTarget={document.body}
                                styles={{
                                    container: (base) => ({ ...base, width: '100%' }),
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    control: (base) => ({
                                        ...base,
                                        borderColor: theme?.secondaryColor,
                                        borderRadius: '0.75rem',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: theme?.primaryColor,
                                            boxShadow: `0 0 0 2px ${theme?.primaryColor}20`
                                        }
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected ? theme?.primaryColor : state.isFocused ? `${theme?.primaryColor}20` : 'white',
                                        color: state.isSelected ? 'white' : 'inherit',
                                    })
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary: theme?.primaryColor,
                                        primary25: `${theme?.primaryColor}20`,
                                    },
                                })}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSearch}
                                disabled={!isSearchEnabled}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                                    isSearchEnabled 
                                        ? 'text-white hover:opacity-90 cursor-pointer' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                style={{
                                    backgroundColor: isSearchEnabled ? theme?.primaryColor : undefined,
                                    boxShadow: isSearchEnabled ? `0 2px 8px ${theme?.primaryColor}40` : 'none'
                                }}
                            >
                                <FaChartLine className="w-4 h-4" />
                                View Final Rating
                            </button>
                            
                            {hasSearched && (
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Helper text when search is disabled */}
                    {!isSearchEnabled && selectedYear && !selectedCycle && (
                        <p className="mt-3 text-sm text-amber-600 flex items-center gap-2">
                            <FaRegClock className="w-4 h-4" />
                            Please select a cycle period to view final rating
                        </p>
                    )}
                </div>

                {/* Results Section */}
                {hasSearched && (
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[400px] bg-white rounded-2xl shadow-lg">
                                <LoaderSpinner />
                            </div>
                        ) : finalRating ? (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* Header with selected filters */}
                                <div 
                                    className="px-6 py-4 border-b"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${theme?.primaryColor}10, ${theme?.secondaryColor}10)`,
                                        borderColor: theme?.secondaryColor 
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="p-2 rounded-lg"
                                                style={{ backgroundColor: `${theme?.primaryColor}20` }}
                                            >
                                                <FaStar className="w-5 h-5" style={{ color: theme?.primaryColor }} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">Final Rating Details</h3>
                                                <p className="text-sm text-gray-500">
                                                    {selectedYear} • {selectedCycle === 'cycle1' ? 'Cycle 1 (Jan-Jun)' : 'Cycle 2 (Jul-Dec)'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Summary Badge */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Final Score:</span>
                                            <span 
                                                className="text-2xl font-bold"
                                                style={{ color: theme?.primaryColor }}
                                            >
                                                {parseFloat(finalRating.totalFinalRating || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Table */}
                                <div className="p-6">
                                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr style={{ backgroundColor: `${theme?.primaryColor}20` }}>
                                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Rating Type</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Rating</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Weightage</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Weighted Rating</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Business Rating Row */}
                                                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div 
                                                                className="p-2 rounded-lg"
                                                                style={{ backgroundColor: `${theme?.primaryColor}10` }}
                                                            >
                                                                <FaChartLine className="w-4 h-4" style={{ color: theme?.primaryColor }} />
                                                            </div>
                                                            <span className="font-medium text-gray-800">Business Rating</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium text-gray-800">
                                                        {finalRating.totalFinalBusinessRating?.toFixed(2) || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                                            80%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium text-gray-800">
                                                        {parseFloat(finalRating.businessRating80Percent || 0).toFixed(2)}
                                                    </td>
                                                </tr>

                                                {/* GLP Rating Row */}
                                                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div 
                                                                className="p-2 rounded-lg"
                                                                style={{ backgroundColor: `${theme?.primaryColor}10` }}
                                                            >
                                                                <FaStar className="w-4 h-4" style={{ color: theme?.primaryColor }} />
                                                            </div>
                                                            <span className="font-medium text-gray-800">GLP Rating</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium text-gray-800">
                                                        {finalRating.totalFinalGLPRating?.toFixed(2) || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                                                            20%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium text-gray-800">
                                                        {parseFloat(finalRating.leadershipRating20Percent || 0).toFixed(2)}
                                                    </td>
                                                </tr>

                                                {/* Final Rating Row */}
                                                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div 
                                                                className="p-2 rounded-lg"
                                                                style={{ backgroundColor: theme?.primaryColor }}
                                                            >
                                                                <FaStar className="w-4 h-4 text-white" />
                                                            </div>
                                                            <span className="font-semibold text-gray-800">Final Rating</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-semibold text-gray-800">
                                                        {parseFloat(finalRating.totalFinalRating || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                                                            100%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-semibold text-gray-800">
                                                        {parseFloat(finalRating.totalFinalRating || 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4 bg-white rounded-2xl shadow-lg">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                                    <FaRegClock className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-lg font-medium text-gray-600 mb-2">No Final Rating Data Available</p>
                                <p className="text-sm text-gray-400">
                                    No rating data found for the selected filters
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinalRating;