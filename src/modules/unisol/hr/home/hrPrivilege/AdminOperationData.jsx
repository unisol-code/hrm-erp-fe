export const AdminOperation = [
    {
        label: "Dashboard",
        url: "/hrDashboard",
        permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
    },
    {
        label: "Core HR",
        url: "/coreHR",
        permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
    },
    {
        label: "Employee Achievement",
        url: "/hr/employeeAchievement",
        permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
    },
    {
        label: 'Payroll Management',
        url: '',
        permissionTypes: ['access'],
        children: [
            {
                label: 'Employee List - Pay slip',
                url: '/emplist',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Payroll Management'
            },
            {
                label: 'Loan Request',
                url: '/emp_loan_RequestList',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Payroll Management'
            },
        ]
    },
    {
        label: 'Attendance Management',
        url: '',
        permissionTypes: ['access'],
        children: [
            {
                label: 'Attendance Dashboard',
                url: '/attendenceDashboard',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Attendance Management'
            },
            {
                label: 'Employee Attendance',
                url: '/employeeAttendence',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Attendance Management'
            },
            {
                label: 'Leave Management',
                url: '/leaveManagement',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Attendance Management'
            },
        ]
    },
    {
        label: 'Onboarding Management',
        url: '',
        permissionTypes: ['access'],
        children: [
            {
                label: 'Add new employee',
                url: '/createEmployee',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Onboarding Management'
            },
            {
                label: 'Doumentation uploads',
                url: '/onboarding_employee',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Onboarding Management'
            },
            {
                label: 'Candidate Profile',
                url: '/candidateProfile',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Onboarding Management'
            },
            {
                label: 'Onboarding workflows',
                url: '/onBoardingTaskVerification',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Onboarding Management'
            },
            {
                label: 'Onboarding Manager',
                url: '/onboardingmanager',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Onboarding Management'
            },
            {
                label: 'Welcome Kit',
                url: '/onboardingmanegment/welcomeKit',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Onboarding Management'
            }
        ]
    },
    {
        label: 'Expense Management',
        url: '',
        permissionTypes: ['access'],
        children: [
            {
                label: 'Expense Approval',
                url: '/expenseApproval',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Expense Management'
            },
            {
                label: 'Overall Expenses',
                url: '/expensesheet',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Expense Management'
            },
        ]
    },
    {
        label: 'Training Management',
        url: '',
        permissionTypes: ['access'],
        children: [
            {
                label: 'Policies',
                url: '/policiesCategory',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Training Management'
            },
            {
                label: 'Training Module',
                url: '/moduleCategory',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Training Management'
            },
            {
                label: 'Question & Answer',
                url: '/questionAnswer',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Training Management'
            },
            {
                label: 'Result',
                url: '/result',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Training Management'
            }
        ]
    },
    {
        label: "Analytics",
        url: "/analytics",
        permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
    },
    {
        label: 'Offboarding Management',
        url: '',
        permissionTypes: ['access'],
        children: [
            {
                label: 'Resignation',
                url: '/offboardingManagement/resignation',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Offboarding Management'
            },
            {
                label: 'Termination',
                url: '/offboardingManagement/termination',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Offboarding Management'
            },
            {
                label: 'Employee Database',
                url: '/offboardingManagement/employeeDatabase',
                permissionTypes: ['create', 'read', 'update', 'delete', 'access'],
                parent: 'Offboarding Management'
            }
        ]
    }
]