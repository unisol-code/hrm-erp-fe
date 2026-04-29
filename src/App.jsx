import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeProtectedRoute from "./routes/EmployeeProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import Profile from "./modules/unisol/hr/Profile";
import OnBoardingTaskVerification from "./modules/unisol/hr/onboardingMangament/OnBoardingTaskVerification";
import HrLayout from "./modules/unisol/layouts/HrLayout";
import EmployeeLayout from "./modules/unisol/layouts/EmployeeLayout";
import LeaveManagement from "./modules/unisol/employee/LeaveManagement";
import AttendanceHistory from "./modules/unisol/employee/AttendanceHistory";
import EducationalDetails from "./modules/unisol/employee/EducationalDetails";
import UploadedRequiredDocuments from "./modules/unisol/employee/UploadedRequiredDocuments";
import Training from "./modules/unisol/employee/Training";
import EducationalOverview from "./modules/unisol/employee/EducationalOverview";
import EmployeesList from "./modules/unisol/hr/EmployeesList";
import AttendenceDashboard from "./modules/unisol/hr/attendanceManagement/AttendenceDashboard";
import EmployeeAttendence from "./modules/unisol/hr/attendanceManagement/EmployeeAttendence";
import EmployeeAttendenceDetails from "./modules/unisol/hr/attendanceManagement/EmployeeAttendenceDetails";
import ViewDetailsLeave from "./components/Dialogs/attendance/ViewDetailsLeave";
import SalesTeam from "./modules/unisol/hr/expenseManagement/overallExpense/SalesTeam";
import CoreHR from "./modules/unisol/hr/coreHR/CoreHR";
import { AllNotification } from "./modules/unisol/hr/AllNotification";
import AddEmployee from "./components/Dialogs/AddEmployee";
import EmployeeDashboard from "./modules/unisol/employee/EmployeeDashboard";
import ResetPassword from "./modules/auth/resetPassword/ResetPassword";
import ConfirmPassword from "./modules/auth/confirmPassword/ConfirmPassword";
import VerifyOtp from "./modules/auth/verifyOTP/VerifyOtp";
import Calender from "./modules/unisol/employee/Calender";
import EmpMarkYourAttendencePopUp from "./components/Dialogs/attendance/EmpMarkYourAttendencePopUp";
import Holiday from "./modules/unisol/hr/dashboard/Holiday";
import ScreeningTraning from "./modules/unisol/employee/ScreeningTraning";
import AdminTraning from "./modules/unisol/employee/AdminTraning";
import HomeDashboard from "./modules/unisol/hr/home/dashboard/HomeDashboard";
import HomeLayout from "./modules/unisol/layouts/HomeLayout";
import EmployeeLogin from "./modules/unisol/hr/home/employeeLogins/EmployeeLogin";
import ExpenseSheet from "./modules/unisol/hr/expenseManagement/overallExpense/ExpenseSheet";
import ExpenseSheet2 from "./modules/unisol/hr/expenseManagement/expenseApproval/ExpenseSheet_2";
import {
  Appraisal,
  BusinessAppraisal,
  RatingOverview,
  BusinessAppraisalList,
  LeadershipAppraisal,
  LeadershipAppraisalList,
  ViewSelfAppraisal2,
  ViewLeadershipAppraisal,
} from "./modules/unisol/employee/appraisal";
import EmployeeMoreDetails from "./modules/unisol/hr/home/dashboard/EmployeeMoreDetails";
import UnisolEmployeeLoginTable from "./modules/unisol/hr/home/employeeLogins/UnisolEmployeeLoginTable";
import EmployeeLoginForm from "./modules/unisol/hr/home/employeeLogins/EmployeeLoginForm";
import ExpenseApproval from "./modules/unisol/hr/expenseManagement/expenseApproval/ExpenseApproval";
import EducationalOverviewAdd from "./modules/unisol/employee/EducationalOverviewAdd";
import {
  PoliciesCategory,
  AddPoliciesCategory,
  ViewPoliciesCategory,
  ModuleCategory,
  AddModuleCategory,
  ViewModuleCategory,
  QuestionAnswer,
  AddQuestionAnswer,
  ViewQuestionAnswer,
  Result,
  ResultView,
} from "./modules/unisol/hr/trainingManagement/index";
import PrivacyPolicy from "./modules/unisol/employee/employeePolicies/PrivacyPolicy";
import RewardProgram from "./modules/unisol/employee/rewardProgram/RewardProgram";
import RewardProgramDetails from "./modules/unisol/employee/rewardProgram/RewardProgramDetails";
import ViewPolicy from "./modules/unisol/employee/employeePolicies/ViewPolicy";
import {
  EmployeeAchievement,
  EmpTrainingList,
  ViewEmpTraining,
  RewardProgramList,
  AddRewardProgram,
  ViewRewardProgram,
} from "./modules/unisol/hr/employeeAchievement";
import {
  ForPolicy,
  ForTraining,
  TakeTest,
  TakeTrainingTest,
  TestPreview,
  TestResult,
  TestTrainingPreview,
  ViewTestResult,
} from "./modules/unisol/employee/selfevaluation";
import {
  AddHRPrivilege,
  HRPrivilege,
  ViewHRPrivilege,
} from "./modules/unisol/hr/home/hrPrivilege/index";
import ViewPolicyOrTrainingQuestionList from "./modules/unisol/hr/trainingManagement/questionAnswer/ViewPolicyOrTrainingQuestionList";
import LoaderSpinner from "./components/LoaderSpinner";
import { useTheme } from "./hooks/theme/useTheme";
import Expense from "./modules/unisol/employee/Component/expense/manageExpense/Expense";
import { HrDashboard, Leave, Meetings } from "./modules/unisol/hr/dashboard";
import HRLeaveManagement from "./modules/unisol/hr/attendanceManagement/HRLeaveManagement";
import { ViewExpenseDetails } from "./modules/unisol/hr/expenseManagement";
import ViewExpenseSheet from "./modules/unisol/hr/expenseManagement/overallExpense/ViewExpenseSheet";
import {
  CandidateProfile,
  CreateEmployee,
  OnboardingWorkflow,
  OnBoardingManager,
} from "./modules/unisol/hr/onboardingMangament";
import {
  EmpList,
  PayslipGenration,
} from "./modules/unisol/hr/payrollManagement";
import { LeaveManagementDetails } from "./modules/unisol/hr/attendanceManagement";
import LoginTabs from "./modules/auth/Login/LoginTabs";
import LeaveList from "./modules/unisol/employee/LeaveList";
import GeneratePaySlip from "./modules/unisol/hr/payrollManagement/GeneratePaySlip";
import MonthlyAttendance from "./modules/unisol/hr/attendanceManagement/MonthlyAttendance";
import MonthlyEmpWise from "./modules/unisol/hr/attendanceManagement/MonthlyEmpWise";
// Welcome Kit Management
import WelcomeKit from "./modules/unisol/hr/onboardingMangament/welcomeKit/Welcomekit";
import AddEditWelcomeKit from "./modules/unisol/hr/onboardingMangament/welcomeKit/AddEditWelcomekit";
import ViewWelcomeKit from "./modules/unisol/hr/onboardingMangament/welcomeKit/ViewWelcomekit";
// Employee loan request apply and view loan request
import LoanRequest from "./modules/unisol/employee/loanRequest/LoanRequest";
import ApplyLoanRequest from "./modules/unisol/employee/loanRequest/ApplyLoanRequest";
import ViewLoanRequest from "./modules/unisol/employee/loanRequest/ViewLoanRequest";
import EmployeeKit from "./modules/unisol/employee/EmployeeKit";
import EmployeeKitEdit from "./modules/unisol/employee/EmployeeKitEdit";
// Admin loan request list and view loan request
import EmpLoanRequestList from "./modules/unisol/hr/payrollManagement/loanRequest/EmpLoanRequestList";
import EmpViewLoanRequest from "./modules/unisol/hr/payrollManagement/loanRequest/EmpViewLoanRequest";
import EmpAnalytics from "./modules/unisol/hr/analytics/EmpAnalytics";


//resignation form empside
import Resignation from "./modules/unisol/employee/resignation/Resignation";
// import ApplyResignationForm from "./modules/unisol/employee/resignation/ApplyResignationForm";
import ApplyResignation from "./modules/unisol/employee/resignation/ApplyResignation";
import ViewResignationPage from "./modules/unisol/employee/resignation/ViewResignationRequest";
import PerEmpLoanReq from "./modules/unisol/hr/payrollManagement/loanRequest/PerEmpLoanReq";


// import for hr side resignation 

import EmpResignation from "./modules/unisol/hr/offboardingManagement/resignation/EmpResignation";
import ViewResignationHR from "./modules/unisol/hr/offboardingManagement/resignation/ViewResignation";
import PerEmpResign from "./modules/unisol/hr/offboardingManagement/resignation/PerEmpResign";
import EmpTermination from "./modules/unisol/hr/offboardingManagement/termination/EmpTermination";
import TerminateEmp from "./modules/unisol/hr/offboardingManagement/termination/addEditEmpTerminate/TerminateEmp";
import EmployeeDatabase from "./modules/unisol/hr/offboardingManagement/employeeDatabase/EmployeeDatabase";
// import for CategoryWise EXpenses 
import EmpWiseTermination from "./modules/unisol/hr/offboardingManagement/termination/EmpWiseTermination";
import ViewEmpTermination from "./modules/unisol/hr/offboardingManagement/termination/ViewEmpTermination";
import ViewEmployeeDatabase from "./modules/unisol/hr/offboardingManagement/employeeDatabase/ViewEmployeeDatabase";
//import for Appraisal List from hr side and admin side
import EmpAppraisalList from "./modules/unisol/hr/employeeAchievement/empAppraisal/EmpAppraisalList";
import EmpWiseAppraisal from "./modules/unisol/hr/employeeAchievement/empAppraisal/EmpWiseAppraisal";
import SetAppraisal from "./modules/unisol/hr/employeeAchievement/empAppraisal/setAppraisal/businessAppraisal/SetAppraisal";
import Goals from "./modules/unisol/hr/employeeAchievement/empAppraisal/setAppraisal/businessAppraisal/Goals";
import ViewAppraisalDetails from "./modules/unisol/hr/employeeAchievement/empAppraisal/setAppraisal/businessAppraisal/ViewAppraisalDetails";
// import for terminated employee page
import TerminatedEmployeePage from "./modules/auth/unauthorizedAccess/TerminatedEmployeePage";
import CategoryWiseExpenses from "./modules/unisol/hr/expenseManagement/overallExpense/CategorWiseExpenses";

import BusinessGoals from "./modules/unisol/hr/employeeAchievement/empAppraisal/setAppraisal/businessAppraisal/BussinesGoals";
// ScrollToTop
import ScrollToTop from "./components/sidebar/ScrollToTop";
// Hr side appraisaal 
import EmpsLeadershipAppraisal from "./modules/unisol/hr/employeeAchievement/empAppraisal/setAppraisal/leadershipAppraisal/EmpsLeadershipAppraisal";
import AddEditLeadershipGoal from "./modules/unisol/hr/employeeAchievement/empAppraisal/setAppraisal/leadershipAppraisal/Addeditleadershipgoal";
import ViewEmpLeadershipAppraisal from "./modules/unisol/hr/employeeAchievement/empAppraisal/setAppraisal/leadershipAppraisal/ViewEmpLeadershipAppraisal";
import FinalRating from "./modules/unisol/employee/appraisal/FinalRating";


function App() {
  const [activeTab, setActiveTab] = useState("EmployeeDashboard");
  const { switchTheme } = useTheme();
  useEffect(() => {
    const companyName = sessionStorage.getItem("companyName");
    if (companyName) {
      switchTheme(companyName);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>

        {/* -----Login Pages----- */}
        <Route path="/" element={<LoginTabs />} />
        <Route path="/unauthorized" element={<TerminatedEmployeePage />} />

        {/* -----Verify OTP Page----- */}
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* -----Password Reset Page----- */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* -----Password confirm Page----- */}
        <Route path="/confirm-password" element={<ConfirmPassword />} />

        {/* -----Unisol Pages----- */}

        <Route element={<EmployeeProtectedRoute />}>
          <Route
            path="/mark-Attendence"
            element={<EmpMarkYourAttendencePopUp />}
          />
          <Route
            path="/emp/allNotification/:id"
            element={
              <EmployeeLayout>
                <AllNotification />
              </EmployeeLayout>
            }
          ></Route>

          {/* ----------Start Employee Dashboard---------- */}
          <Route
            path="/EmployeeDashboard"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeeDashboard />
              </EmployeeLayout>
            }
          />
          <Route
            path="/EmployeeDashboard/downloadPaySlip/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <GeneratePaySlip></GeneratePaySlip>{" "}
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/educationalOverview"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EducationalOverview />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/employeeOverview/employeeKit"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeeKit />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/employeeOverview/employeeKit/edit"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeeKitEdit />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/uploadedRequiredDocuments"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <UploadedRequiredDocuments />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/training"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Training></Training>
              </EmployeeLayout>
            }
          />

          <Route
            path="/dashboard/educationalDetails"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EducationalDetails></EducationalDetails>
              </EmployeeLayout>
            }
          ></Route>
          <Route
            path="/emp/educationalOverview/add"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EducationalOverviewAdd></EducationalOverviewAdd>
              </EmployeeLayout>
            }
          ></Route>
          <Route
            path="/dashboard/uploadedRequiredDocuments"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <UploadedRequiredDocuments />
              </EmployeeLayout>
            }
          ></Route>
          <Route
            path="/dashboard/educationalOverview"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EducationalOverview />
              </EmployeeLayout>
            }
          ></Route>
          <Route
            path="/adminTraining"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AdminTraning />
              </EmployeeLayout>
            }
          ></Route>
          <Route
            path="/hrTraining"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Training></Training>
              </EmployeeLayout>
            }
          ></Route>
          <Route
            path="/screeningTraining"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ScreeningTraning />
              </EmployeeLayout>
            }
          ></Route>

          {/* Employee Calender */}

          <Route
            path="/EmployeeDashboard/calender/:id?"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Calender></Calender>
              </EmployeeLayout>
            }
          ></Route>

          {/* ----------Start Reaward Program---------- */}
          <Route
            path="/emp/rewardprogram"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <RewardProgram />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/rewardprogram/viewrewardprogramdetails/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <RewardProgramDetails />
              </EmployeeLayout>
            }
          />

          {/* ----------End Reaward Program---------- */}

          {/*----------Appraisal----------*/}
          <Route
            path="/emp/appraisal"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Appraisal />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/appraisal/ratingoverview"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <RatingOverview />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/appraisal/final-rating"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <FinalRating />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/appraisal/businessappraisal"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <BusinessAppraisalList />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/appraisal/leadershipappraisal"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <LeadershipAppraisalList />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/appraisal/leadershipappraisal/giveappraisal"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <LeadershipAppraisal />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/appraisal/leadershipappraisal/edit-appraisal/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <LeadershipAppraisal />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/appraisal/businessappraisal/giveappraisal"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <BusinessAppraisal />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/appraisal/leadershipappraisal/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewLeadershipAppraisal />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/appraisal/business-appraisal/view-appraisal/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewSelfAppraisal2 />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/appraisal/business-appraisal/edit-appraisal/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <BusinessAppraisal />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/privacypolicy"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <PrivacyPolicy />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/privacypolicy/view/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewPolicy />
              </EmployeeLayout>
            }
          />
          {/* Loan Request */}



          <Route
            path="/emp/loanrequest"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <LoanRequest />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/loanrequest/addloanrequest"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ApplyLoanRequest />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/loanrequest/editloanrequest/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ApplyLoanRequest />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/loanrequest/viewloanrequest/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewLoanRequest />
              </EmployeeLayout>
            }
          />

          {/*Self Evaluation*/}

          {/* ----------for policy---------- */}
          <Route
            path="/emp/selfevaluation/policy"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ForPolicy />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/selfevaluation/policy/taketest"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <TakeTest />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/selfevaluation/policy/taketest/preview"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <TestPreview />
              </EmployeeLayout>
            }
          />

          {/* ----------for training---------- */}
          <Route
            path="/emp/selfevaluation/training"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ForTraining />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/selfevaluation/training/taketest"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <TakeTrainingTest />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/selfevaluation/training/taketest/preview"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <TestTrainingPreview />
              </EmployeeLayout>
            }
          />
          {/*-----------Resignation*-------------*/}
          <Route
            path="/emp/resignation"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Resignation />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/resignation/applyforresignation"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ApplyResignation />
              </EmployeeLayout>
            }
          />

          <Route
            path="/emp/resignation/editresignation/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ApplyResignation />
              </EmployeeLayout>
            }
          />
          <Route path="/emp/resignation/viewresignation/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewResignationPage />
              </EmployeeLayout>
            }
          />

          {/* <Route path="/emp/resignation/editresignation/:id"
           element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewResignationPage/>
              </EmployeeLayout>
            }
          /> */}


          {/* ----------for test result---------- */}

          <Route
            path="/emp/selfevaluation/testresult"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <TestResult />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/selfevaluation/testresult/viewtestresult/:id"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewTestResult />
              </EmployeeLayout>
            }
          />

          {/* ----------End Self Evaluation---------- */}
          {/* <Route
            path="/emp/expense"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <TestResult />
              </EmployeeLayout>
            }
          /> */}
          <Route
            path="/EmployeeDashboard/emp/attendanceHistory"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AttendanceHistory></AttendanceHistory>
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/educationalDetails"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EducationalDetails></EducationalDetails>
              </EmployeeLayout>
            }
          />

          <Route
            path="/EmployeeDashboard/emp/leavemanagement"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <LeaveManagement></LeaveManagement>
              </EmployeeLayout>
            }
          ></Route>
          <Route
            path="/EmployeeDashboard/emp/leavemanagement/leaveStatus/:empId"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <LeaveManagementDetails />
              </EmployeeLayout>
            }
          ></Route>
          <Route
            path="/EmployeeDashboard/emp/expense"
            element={
              <EmployeeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Expense />
              </EmployeeLayout>
            }
          ></Route>
        </Route>

        <Route element={<AdminProtectedRoute />}>
          {/*--------------------- HR Layout------------ */}
          <Route path="/addEmp" element={<AddEmployee></AddEmployee>} />
          {/* Particular Company Dashboard start */}
          <Route
            path="/hrDashboard"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <HrDashboard> </HrDashboard>
              </HrLayout>
            }
          />
          <Route
            path="/hrDashboard/meetings"
            element={
              <HrLayout>
                <Meetings></Meetings>
              </HrLayout>
            }
          ></Route>
          <Route
            path="/hrDashboard/leaves"
            element={
              <HrLayout>
                <Leave />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/hrDashboard/holiday"
            element={
              <HrLayout>
                <Holiday />
              </HrLayout>
            }
          ></Route>
          {/* Particular Company Dashboard end */}
          {/* Home Dashboard start */}
          <Route
            path="/homeDashboard"
            element={
              <HomeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <HomeDashboard></HomeDashboard>
              </HomeLayout>
            }
          />
          <Route
            path="/homeDashboard/employeeDetails/:companyName"
            element={
              <HomeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeeMoreDetails />
              </HomeLayout>
            }
          />
          <Route
            path="/employeeLogins"
            element={
              <HomeLayout>
                <EmployeeLogin></EmployeeLogin>
              </HomeLayout>
            }
          ></Route>
          <Route
            path="/employeeLogins/unisolEdit"
            element={
              <HomeLayout>
                <UnisolEmployeeLoginTable></UnisolEmployeeLoginTable>
              </HomeLayout>
            }
          ></Route>
          <Route
            path="/employeeLogins/employeeEdit/:id"
            element={
              <HomeLayout>
                <EmployeeLoginForm></EmployeeLoginForm>
              </HomeLayout>
            }
          ></Route>
          {/* Home Dashboard end */}
          {/*Core HR*/}
          <Route
            path="/coreHR"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <CoreHR></CoreHR>
              </HrLayout>
            }
          />
          {/* ----------- Employee Achievements ------------- */}
          <Route
            path="/hr/employeeAchievement"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeeAchievement />
              </HrLayout>
            }
          />
          <Route
            path="/hr/employeeAchievement/empTrainingList"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpTrainingList />
              </HrLayout>
            }
          />

          <Route
            path="/hr/employeeAchievement/empTrainingList/viewEmpTraining/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewEmpTraining />
              </HrLayout>
            }
          />
          <Route
            path="/hr/employeeAchievement/employeeRewards/rewardProgramList"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <RewardProgramList />
              </HrLayout>
            }
          />
          <Route
            path="/hr/employeeAchievement/employeeRewards/addRewardProgram"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddRewardProgram />
              </HrLayout>
            }
          />
          <Route
            path="/hr/employeeAchievement/employeeRewards/viewRewardProgram/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewRewardProgram />
              </HrLayout>
            }
          />

          <Route
            path="/hr/employeeAchievement/employeeRewards/editRewardProgram/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddRewardProgram />
              </HrLayout>
            }
          />
          <Route
            path="/hr/employeeAchievement/appraisalList"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpAppraisalList />
              </HrLayout>
            }
          />
          <Route
            path="/hr/employeeAchievement/appraisalList/empWiseAppraisal/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpWiseAppraisal />
              </HrLayout>
            }
          />

          <Route
            path="/hr/employeeAchievement/appraisalList/setAppraisal"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <SetAppraisal />
              </HrLayout>
            }
          />
          <Route
            path="/hr/employeeAchievement/appraisalList/goals"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Goals />
              </HrLayout>
            }
          />
          {/* ---------- Leadership Appraisal Routes ---------- */}
          <Route
            path="/hr/employeeAchievement/appraisalList/leadership-Appraisal"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpsLeadershipAppraisal />
              </HrLayout>
            }
          />
          <Route
            path="/hr/employeeAchievement/appraisalList/leadershipGoals/add"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddEditLeadershipGoal />
              </HrLayout>
            }
          />


          <Route
            path="/hr/employeeAchievement/appraisalList/leadershipGoals/edit/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddEditLeadershipGoal />
              </HrLayout>
            }
          />

          <Route
            path="/hr/employeeAchievement/appraisalList/businessGoals"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <BusinessGoals />
              </HrLayout>
            }
          />

          <Route
            path="/hr/employeeAchievement/appraisalList/businessGoals/edit/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <BusinessGoals />
              </HrLayout>
            }
          />

          <Route
            path="/hr/employeeAchievement/appraisalList/viewAppraisalDetails/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewAppraisalDetails />
              </HrLayout>
            }
          />

          <Route
            path="/hr/employeeAchievement/appraisalList/empWiseAppraisal/view-leadership-Appraisal/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewEmpLeadershipAppraisal />
              </HrLayout>
            }
          />

          {/* Onboarding Process documentsUpload routes*/}
          <Route
            path="/onboarding_employee"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeesList></EmployeesList>
              </HrLayout>
            }
          />
          <Route
            path="/candidateProfile/profile/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Profile></Profile>
              </HrLayout>
            }
          />
          <Route
            path="/candidateProfile"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <CandidateProfile></CandidateProfile>
              </HrLayout>
            }
          />
          <Route
            path="/onBoardingTaskVerification"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <OnBoardingTaskVerification></OnBoardingTaskVerification>
              </HrLayout>
            }
          />
          <Route
            path="/createEmployee"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <CreateEmployee></CreateEmployee>
              </HrLayout>
            }
          />
          <Route
            path="/onBoardingTaskVerification/onBoardingWorkflow"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <OnboardingWorkflow></OnboardingWorkflow>
              </HrLayout>
            }
          />
          <Route
            path="/onboardingmanager"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <OnBoardingManager></OnBoardingManager>
              </HrLayout>
            }
          />
          {/* Onboarding Welcome Kit */}
          <Route
            path="/onboardingmanegment/welcomeKit"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <WelcomeKit></WelcomeKit>
              </HrLayout>
            }
          />
          <Route
            path="/onboardingmanegement/welcomeKit/viewWelcomeKit/:id" element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewWelcomeKit></ViewWelcomeKit>
              </HrLayout>
            }
          />

          <Route
            path="/onboardingmanegement/welcomeKit/addEditWelcomeKit"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddEditWelcomeKit></AddEditWelcomeKit>
              </HrLayout>
            }
          />
          <Route
            path="/onboardingmanegement/welcomeKit/addEditWelcomeKit/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddEditWelcomeKit></AddEditWelcomeKit>
              </HrLayout>
            }
          />


          {/* Payroll Management */}
          <Route
            path="/emplist"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpList></EmpList>{" "}
              </HrLayout>
            }
          />
          <Route
            path="/emplist/generatePayslip/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <GeneratePaySlip></GeneratePaySlip>{" "}
              </HrLayout>
            }
          />
          {/* <Route
            path="/paySlip"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <PayslipGenration></PayslipGenration>{" "}
              </HrLayout>
            }
          /> */}
          <Route
            path="/leaveManagement"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <HRLeaveManagement />{" "}
              </HrLayout>
            }
          ></Route>
          <Route
            path="/leaveManagement/leaveManagementDetails/:empId"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                {" "}
                <LeaveManagementDetails />{" "}
              </HrLayout>
            }
          ></Route>
          <Route
            path="/viewDetailsLeave"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                {" "}
                <ViewDetailsLeave />{" "}
              </HrLayout>
            }
          ></Route>
          {/* Employee Loan Request */}
          <Route path="/emp_loan_RequestList" element={
            <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              <EmpLoanRequestList />
            </HrLayout>
          }>
          </Route>
          <Route path="/emp_loan_RequestList/per_Emp_Loan_Request/:employeeId" element={
            <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              <PerEmpLoanReq />
            </HrLayout>
          }>
          </Route>
          <Route path="/emp_loan_RequestList/per_Emp_Loan_Request/emp_view_Loan_Request/:id" element={
            <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              <EmpViewLoanRequest />
            </HrLayout>
          }>

          </Route>

          {/* Attendence Management */}
          <Route
            path="/attendenceDashboard"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AttendenceDashboard />{" "}
              </HrLayout>
            }
          />
          <Route
            path="/employeeAttendence"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeeAttendence />{" "}
              </HrLayout>
            }
          />

          <Route
            path="/employeeAttendence/monthlyAttendance"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <MonthlyAttendance />{" "}
              </HrLayout>
            }
          />

          <Route
            path="/leaveManagement"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <HRLeaveManagement />{" "}
              </HrLayout>
            }
          />
          <Route
            path="/employeeAttendence/employeeAttendenceDetails/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeeAttendenceDetails />{" "}
              </HrLayout>
            }
          />

          <Route
            path="/employeeAttendence/employeeAttendenceDetails/:id/:year/:month"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <MonthlyEmpWise />{" "}
              </HrLayout>
            }
          />

          <Route
            path="/leaveManagementDetails"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                {" "}
                <LeaveManagementDetails />{" "}
              </HrLayout>
            }
          />
          <Route
            path="/viewDetailsLeave"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                {" "}
                <ViewDetailsLeave />{" "}
              </HrLayout>
            }
          />
          {/* Expense Management */}
          <Route
            path="/expenseApproval"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ExpenseApproval />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/expenseApproval/viewExpenseDetails/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewExpenseDetails />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/expensesheet/viewExpenseSheet/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewExpenseSheet />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/expenseApproval/expense-sheet-2/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ExpenseSheet2 />
              </HrLayout>
            }
          />
          <Route
            path="/expensesheet"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <SalesTeam />{" "}
              </HrLayout>
            }
          ></Route>
          <Route
            path="/expensesheet/categorywiseexpense"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <CategoryWiseExpenses />
              </HrLayout>
            }
          >
          </Route>
          <Route
            path="/expensesheet/expensesheetDetail/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ExpenseSheet />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/policiesCategory"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <PoliciesCategory />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/policiesCategory/add"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddPoliciesCategory />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/policiesCategory/view/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewPoliciesCategory />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/policiesCategory/edit/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddPoliciesCategory />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/allNotification/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AllNotification />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/moduleCategory"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Suspense fallback={<LoaderSpinner />}>
                  <ModuleCategory />
                </Suspense>
              </HrLayout>
            }
          ></Route>
          <Route
            path="/moduleCategory/add"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddModuleCategory />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/moduleCategory/edit/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddModuleCategory />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/moduleCategory/view/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewModuleCategory />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/questionAnswer"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <QuestionAnswer />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/questionAnswer/module/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewPolicyOrTrainingQuestionList />
              </HrLayout>
            }
          />
          <Route
            path="/questionAnswer/add"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddQuestionAnswer />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/questionAnswer/edit/:qaId/:questionId"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddQuestionAnswer />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/questionAnswer/module/:id/question/:qaId/view/:questionId"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewQuestionAnswer />
              </HrLayout>
            }
          ></Route>
          {/*----------------HR Privilege start----------------*/}
          <Route
            path="home/hrPrivilege"
            element={
              <HomeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <HRPrivilege />
              </HomeLayout>
            }
          ></Route>
          <Route
            path="home/hrPrivilege/view/:id"
            element={
              <HomeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewHRPrivilege />
              </HomeLayout>
            }
          ></Route>
          <Route
            path="home/hrPrivilege/edit/:id"
            element={
              <HomeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddHRPrivilege />
              </HomeLayout>
            }
          ></Route>
          <Route
            path="home/hrPrivilege/add"
            element={
              <HomeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AddHRPrivilege />
              </HomeLayout>
            }
          ></Route>

          {/* ---------------- Analytics -------------------- */}
          <Route
            path="/analytics"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpAnalytics />
              </HrLayout>
            }
          ></Route>

          {/* ------------ OffBoarding Management --------- */}

          <Route
            path="/offboardingManagement/resignation"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpResignation />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/offboardingManagement/resignation/perempresign/:employeeId"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <PerEmpResign />
              </HrLayout>
            }>
          </Route>

          <Route
            path="/offboardingManagement/resignation/viewresignation/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewResignationHR />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/offboardingManagement/termination"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpTermination />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/offboardingManagement/termination/emp-wise/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmpWiseTermination />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/offboardingManagement/termination/terminate-emp"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <TerminateEmp />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/offboardingManagement/termination/edit-emp-wise/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <TerminateEmp />
              </HrLayout>
            }
          ></Route>

          <Route
            path="/offboardingManagement/termination/view-emp-wise/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewEmpTermination />
              </HrLayout>
            }
          ></Route>

          <Route
            path="/offboardingManagement/employeeDatabase"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <EmployeeDatabase />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/offboardingManagement/employeeDatabase/view/:id"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ViewEmployeeDatabase />
              </HrLayout>
            }
          ></Route>


          {/* ----------------HR Privilege end----------------*/}
          <Route
            path="/result"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Result />
              </HrLayout>
            }
          ></Route>
          <Route
            path="/result/view/:resultId/:empId"
            element={
              <HrLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <ResultView />
              </HrLayout>
            }
          ></Route>
        </Route>
      </Routes>
    </Router >
  );
}

export default App;
