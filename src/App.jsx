import { Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import VerifyCertificate from './pages/public/VerifyCertificate';

// Student Dashboard
import StudentDashboard from './pages/student/StudentDashboard';
import LearningModules from './pages/student/LearningModules';
import Assignments from './pages/student/Assignments';
import Assessments from './pages/student/Assessments';
import ProjectSubmission from './pages/student/ProjectSubmission';
import ProgressTracker from './pages/student/ProgressTracker';
import TeamMembers from './pages/student/TeamMembers';
import Profile from './pages/student/Profile';

// Mentor Dashboard
import MentorDashboard from './pages/mentor/MentorDashboard';
import AssignedStudents from './pages/mentor/AssignedStudents';
import ManageTeams from './pages/mentor/ManageTeams';
import ManageBatchesMentor from './pages/mentor/ManageBatchesMentor';
import UploadMaterials from './pages/mentor/UploadMaterials';
import CreateAssignments from './pages/mentor/CreateAssignments';
import CreateAssessments from './pages/mentor/CreateAssessments';
import ReviewSubmissions from './pages/mentor/ReviewSubmissions';
import GiveFeedback from './pages/mentor/GiveFeedback';
import ApproveProject from './pages/mentor/ApproveProject';
import DistributeCertificates from './pages/mentor/DistributeCertificates';

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageMentors from './pages/admin/ManageMentors';
import ManagePrograms from './pages/admin/ManagePrograms';
import ManageBatches from './pages/admin/ManageBatches';
import GenerateCertificates from './pages/admin/GenerateCertificates';
import VerifyCertificatesAdmin from './pages/admin/VerifyCertificatesAdmin';
import ViewReports from './pages/admin/ViewReports';

// Scroll to top and track pageviews on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Track Google Analytics pageview
    ReactGA.send({ hitType: "pageview", page: pathname });
  }, [pathname]);
  return null;
};

// Initialize Google Analytics with the Measurement ID
ReactGA.initialize('G-BQ611LK4QN');

const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('internsphere_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-certificate" element={<VerifyCertificate />} />

        {/* Student Dashboard Routes */}
        <Route element={<DashboardLayout allowedRole="student" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/modules" element={<LearningModules />} />
          <Route path="/student/assignments" element={<Assignments />} />
          <Route path="/student/assessments" element={<Assessments />} />
          <Route path="/student/project" element={<ProjectSubmission />} />
          <Route path="/student/progress" element={<ProgressTracker />} />
          <Route path="/student/teams" element={<TeamMembers />} />
          <Route path="/student/profile" element={<Profile />} />
        </Route>

        {/* Mentor Dashboard Routes */}
        <Route element={<DashboardLayout allowedRole="mentor" />}>
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/mentor/students" element={<AssignedStudents />} />
          <Route path="/mentor/teams" element={<ManageTeams />} />
          <Route path="/mentor/batches" element={<ManageBatchesMentor />} />
          <Route path="/mentor/materials" element={<UploadMaterials />} />
          <Route path="/mentor/assignments" element={<CreateAssignments />} />
          <Route path="/mentor/assessments" element={<CreateAssessments />} />
          <Route path="/mentor/reviews" element={<ReviewSubmissions />} />
          <Route path="/mentor/feedback" element={<GiveFeedback />} />
          <Route path="/mentor/projects" element={<ApproveProject />} />
          <Route path="/mentor/certificates" element={<DistributeCertificates />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route element={<DashboardLayout allowedRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/mentors" element={<ManageMentors />} />
          <Route path="/admin/programs" element={<ManagePrograms />} />
          <Route path="/admin/batches" element={<ManageBatches />} />
          <Route path="/admin/certificates" element={<GenerateCertificates />} />
          <Route path="/admin/verify" element={<VerifyCertificatesAdmin />} />
          <Route path="/admin/reports" element={<ViewReports />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
