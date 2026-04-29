// components/TerminatedEmployeePage.jsx
import React from 'react';
import { 
  FaExclamationTriangle, 
  FaUserTimes, 
  FaDoorClosed, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaIdCard 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TerminatedEmployeePage = ({ userData: userDataProp }) => {
  const navigate = useNavigate();

  const getTerminationMessage = (status) => {
    switch(status?.toLowerCase()) {
      case 'terminated':
        return 'Your employment has been terminated.';
      case 'resigned':
        return 'You have resigned from the company.';
      case 'inactive':
        return 'Your account has been deactivated.';
      default:
        return 'Your account is no longer active.';
    }
  };

  const getContactInfo = () => {
    return {
      hrEmail: 'hr@company.com',
      hrPhone: '+91-XXX-XXX-XXXX',
      adminEmail: 'admin@company.com'
    };
  };

  // Use prop data or fallback to default
  const userData = userDataProp || {
    employeeId: 'EMP12345',
    department: 'Sales',
    terminationStatus: 'terminated'
  };

  const contactInfo = getContactInfo();

  const handleLogout = () => {
    // Clear any stored tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center overflow-hidden px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-md mb-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 text-3xl mr-3 flex-shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-red-900">
                Account Access Restricted
              </h1>
              <p className="text-red-700 text-base mt-1">
                {getTerminationMessage(userData.terminationStatus)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Warning Message */}
          <div className="bg-yellow-50 border-b border-yellow-200 p-4">
            <div className="flex items-start">
              <FaUserTimes className="text-yellow-600 text-xl mr-3 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-base font-semibold text-yellow-900 mb-1">
                  Important Notice
                </h2>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  Your access to the employee portal has been revoked as your employment 
                  with the company has ended. All system access has been terminated.
                </p>
              </div>
            </div>
          </div>

          {/* User Information and Contact Information - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200">
            {/* User Information */}
            <div className="p-4 border-r border-gray-200">
              <div className="flex items-center mb-3">
                <FaIdCard className="text-gray-600 text-lg mr-2" />
                <h2 className="text-base font-semibold text-gray-900">
                  Employee Information
                </h2>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Employee ID</p>
                  <p className="font-semibold text-gray-900 text-base">{userData.employeeId}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Department</p>
                  <p className="font-semibold text-gray-900 text-base">
                    {userData.department || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-4">
              <div className="flex items-center mb-3">
                <FaBuilding className="text-gray-600 text-lg mr-2" />
                <h2 className="text-base font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FaEnvelope className="text-gray-500 mr-2 mt-1 flex-shrink-0 text-sm" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1">HR Department Email</p>
                    <a 
                      href={`mailto:${contactInfo.hrEmail}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {contactInfo.hrEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="text-gray-500 mr-2 mt-1 flex-shrink-0 text-sm" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1">HR Contact Number</p>
                    <a 
                      href={`tel:${contactInfo.hrPhone}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {contactInfo.hrPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Next Steps
            </h2>
            <ol className="space-y-2">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full font-semibold mr-2 text-xs">
                  1
                </span>
                <p className="text-gray-700 text-sm pt-0.5">
                  Contact HR department for any queries regarding your termination
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full font-semibold mr-2 text-xs">
                  2
                </span>
                <p className="text-gray-700 text-sm pt-0.5">
                  Return all company assets if not already done
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full font-semibold mr-2 text-xs">
                  3
                </span>
                <p className="text-gray-700 text-sm pt-0.5">
                  Complete exit formalities and collect your relieving letter
                </p>
              </li>
            </ol>
          </div>

          {/* Logout Button */}
          <div className="bg-gray-50 px-4 py-3 flex justify-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <FaDoorClosed className="mr-2" />
              Return to Login Page
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-600">
            If you believe this is an error, please contact HR department immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerminatedEmployeePage;