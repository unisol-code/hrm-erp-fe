import React from 'react';
import LoaderSpinner from '../../../../../../components/LoaderSpinner';
import { FaStar, FaChartLine } from 'react-icons/fa';

const EmpWiseFinalRating = ({ data, loading, theme }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <LoaderSpinner />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <FaStar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-600 mb-2">No Final Rating Data Available</p>
                <p className="text-sm text-gray-400">
                    No rating data found for the selected filters
                </p>
            </div>
        );
    }

    // Map API response data to the display format
    const businessRating = data.totalFinalBusinessRating ?? 0;
    const businessWeighted = parseFloat(data.businessRating80Percent) ?? 0;
    const businessWeightage = 80; // Fixed weightage for business

    const glpRating = data.totalFinalGLPRating ?? 0;
    const glpWeighted = parseFloat(data.leadershipRating20Percent) ?? 0;
    const glpWeightage = 20; // Fixed weightage for GLP

    const finalRating = parseFloat(data.totalFinalRating) ?? 0;

    return (
        <div className="space-y-6">
            {/* Rating Table */}
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
                                {businessRating ? businessRating.toFixed(2) : '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                    {businessWeightage}%
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center font-medium text-gray-800">
                                {businessWeighted ? businessWeighted.toFixed(2) : '-'}
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
                                {glpRating ? glpRating.toFixed(2) : '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                                    {glpWeightage}%
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center font-medium text-gray-800">
                                {glpWeighted ? glpWeighted.toFixed(2) : '-'}
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
                                {finalRating ? finalRating.toFixed(2) : '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                                    100%
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-gray-800">
                                {finalRating ? finalRating.toFixed(2) : '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmpWiseFinalRating;