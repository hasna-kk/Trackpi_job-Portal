import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* Pages */
import Home from "./pages/Home";
/* Admin Pages */

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import PostJob from "./pages/admin/PostJob";
import AdminApplicants from "./pages/admin/AdminApplicants";
import AdminManagement from "./pages/admin/AdminManagement";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminHiringPartners from "./pages/admin/AdminHiringPartners";
import AddHiringPartner from "./pages/admin/AddHiringPartner";
import HiringPartnerDetails from "./pages/admin/HiringPartnerDetails";
import EditHiringPartner from "./pages/admin/EditHiringPartner";
import AdminCandidateDetails from "./pages/admin/AdminCandidateDetails";
import AdminResumeCandidates from "./pages/admin/AdminResumeCandidates";
// Import new Admin pages as placeholders or actual if exist, for now just reuse or placeholders for routing
import UserDashboard from "./pages/user/UserDashboard";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import PermissionManagement from "./pages/admin/PermissionManagement";
import CreatePermission from "./pages/admin/CreatePermission";
import AdminLogin from "./pages/admin/AdminLogin";
import UserManagement from "./pages/admin/UserManagement";
import FormManagement from "./pages/admin/FormManagement";
import FormDetails from "./pages/admin/FormDetails";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCompetition from "./pages/admin/AdminCompetition";
import AdminCompetitionTestimonials from "./pages/admin/AdminCompetitionTestimonials";
import AddCompetitionTestimonial from "./pages/admin/AddCompetitionTestimonial";
import EditCompetitionTestimonial from "./pages/admin/EditCompetitionTestimonial";
import CompetitionTestimonialDetails from "./pages/admin/CompetitionTestimonialDetails";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminPreviousWinners from "./pages/admin/AdminPreviousWinners";
import AdminCompetitionCandidates from "./pages/admin/AdminCompetitionCandidates";

// Removed placeholder implementations



import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LinkedInCallback from "./pages/LinkedInCallback";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
import AppliedJobs from "./pages/AppliedJobs";
import BrowseJobs from "./pages/BrowseJobs";
import AddTestimonial from "./pages/admin/AddTestimonial";
import TestimonialDetails from "./pages/admin/TestimonialDetails";
import EditTestimonial from "./pages/admin/EditTestimonial";
import AdminTeam from "./pages/admin/AdminTeam";
import AddTeamMember from "./pages/admin/AddTeamMember";
import EditTeamMember from "./pages/admin/EditTeamMember";
/* Route Protection */
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import RedirectIfSuperAdmin from "./components/RedirectIfSuperAdmin";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import { PERMISSIONS } from "./constants/permissions";

import ResumeGen from "./pages/ResumeGen";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import TalentLeague from "./pages/TalentLeague";
import UiUxCompetition from "./pages/UiUxCompetition";
import Creators from "./pages/Creators";
import Jobs from "./pages/Jobs";
import Terms from "./pages/Terms";
import CompetitionTestimonials from "./pages/CompetitionTestimonials";
import CompetitionCompleted from "./pages/CompetitionCompleted";
import CompetitionResult from "./pages/CompetitionResult";
import CompetitionFailed from "./pages/CompetitionFailed";
import CompetitionPending from "./pages/CompetitionPending";
import CompetitionIntro from "./pages/CompetitionIntro";
import CompetitionTask from "./pages/CompetitionTask";
import CompetitionFinished from "./pages/CompetitionFinished";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* =================================================================
            1. PUBLIC ROUTES (Accessible to ALL, never blocked or redirected)
            ================================================================= */}
        {/* Home is now Restricted for Auth Users */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/competition/testimonials" element={<CompetitionTestimonials />} />
        <Route path="/talent-league" element={<TalentLeague />} />
        <Route path="/competition/ui-ux" element={<UiUxCompetition />} />
        <Route path="/competition/completed" element={<CompetitionCompleted />} />
        <Route path="/competition/result" element={<CompetitionResult />} />
        <Route path="/competition/failed" element={<CompetitionFailed />} />
        <Route path="/competition/pending" element={<CompetitionPending />} />
        <Route path="/competition/intro" element={<CompetitionIntro />} />
        <Route path="/competition/task" element={<CompetitionTask />} />
        <Route path="/competition/finished" element={<CompetitionFinished />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/resume-gen" element={<ResumeGen />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/terms" element={<Terms />} />

        {/* Helper for LinkedIn Callback (Public but handles its own logic) */}
        <Route path="/linkedin/callback" element={<LinkedInCallback />} />

        {/* =================================================================
            2. AUTH ROUTES (Only for GUESTS. Logged-in users -> Profile)
            ================================================================= */}
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* =================================================================
            3. PROTECTED ROUTES (Only for Authenticated Users)
            ================================================================= */}
        <Route element={<ProtectedRoute />}>

          {/* User Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/browse-jobs" element={<BrowseJobs />} />

        </Route>

        {/* =================================================================
            4. ADMIN ROUTES
            ================================================================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }

        >
          {/* Dashboard Route */}
          <Route path="dashboard" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.DASHBOARD_VIEW}><AdminDashboard /></ProtectedAdminRoute>} />

          {/* Jobs */}
          <Route path="jobs" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.JOBS_VIEW}><AdminJobs /></ProtectedAdminRoute>} />
          <Route path="jobs/post" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.JOBS_POST}><PostJob /></ProtectedAdminRoute>} />
          <Route path="jobs/edit/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.JOBS_EDIT}><PostJob /></ProtectedAdminRoute>} />
          <Route path="jobs/view/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.JOBS_VIEW}><PostJob /></ProtectedAdminRoute>} />

          {/* Applicants */}
          <Route path="candidates/applicants/:jobId?" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.APPLICANTS_VIEW}><AdminApplicants /></ProtectedAdminRoute>} />
          <Route path="/admin/testimonials/add" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.VIEW_APPLICATIONS}><AddTestimonial /></ProtectedAdminRoute>} />
          <Route path="testimonials/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.MANAGE_TESTIMONIALS}><TestimonialDetails /></ProtectedAdminRoute>} />
          <Route path="/admin/testimonials/edit/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.MANAGE_TESTIMONIALS}><EditTestimonial /></ProtectedAdminRoute>} />


          {/* Signup Candidates */}
          <Route path="candidates/signup" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.SIGNUP_VIEW}><AdminApplicants /></ProtectedAdminRoute>} />
          <Route path="candidates/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.SIGNUP_VIEW_DETAILS}><AdminCandidateDetails /></ProtectedAdminRoute>} />

          {/* Resume Build Candidates */}
          <Route path="candidates/resume" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.RESUME_VIEW}><AdminResumeCandidates /></ProtectedAdminRoute>} />

          {/* Super Admin Routes */}
          <Route path="management" element={<ProtectedAdminRoute><AdminManagement /></ProtectedAdminRoute>} />
          <Route path="permissions" element={<ProtectedAdminRoute><PermissionManagement /></ProtectedAdminRoute>} />
          <Route path="permissions/create" element={<ProtectedAdminRoute><CreatePermission /></ProtectedAdminRoute>} />
          <Route path="permissions/edit/:id" element={<ProtectedAdminRoute><CreatePermission /></ProtectedAdminRoute>} />

          {/* User Management */}
          <Route path="users" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.USERS_EDIT}><UserManagement /></ProtectedAdminRoute>} />
          <Route path="forms" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.FORMS_MANAGE}><FormManagement /></ProtectedAdminRoute>} />
          <Route path="forms/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.FORMS_MANAGE}><FormDetails /></ProtectedAdminRoute>} />
          {/* Placeholder routes for others to prevent crashes if clicked */}
          <Route path="partners" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.MANAGE_PARTNERS}>
            <AdminHiringPartners />
          </ProtectedAdminRoute>} />
          <Route path="/admin/partners/add" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.MANAGE_PARTNERS}><AddHiringPartner /></ProtectedAdminRoute>} />
          <Route path="partners/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.MANAGE_PARTNERS}><HiringPartnerDetails /></ProtectedAdminRoute>} />
          <Route path="/admin/partners/edit/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.MANAGE_PARTNERS}><EditHiringPartner /></ProtectedAdminRoute>} />

          <Route
            path="testimonials"
            element={
              <ProtectedAdminRoute requiredPermission={PERMISSIONS.MANAGE_TESTIMONIALS}>
                <AdminTestimonials />
              </ProtectedAdminRoute>
            }
          />


          {/* System Settings */}
          <Route path="settings" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.SETTINGS_MANAGE}><AdminSettings /></ProtectedAdminRoute>} />

          {/* Our Team */}
          <Route path="team" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.TEAM_VIEW}><AdminTeam /></ProtectedAdminRoute>} />
          <Route path="team/add" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.TEAM_VIEW}><AddTeamMember /></ProtectedAdminRoute>} />
          <Route path="team/edit/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.TEAM_VIEW}><EditTeamMember /></ProtectedAdminRoute>} />

          {/* Talent League Pages */}
          <Route path="competition" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.COMPETITION_VIEW}><AdminCompetition /></ProtectedAdminRoute>} />
          <Route path="competition/testimonials" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW}><AdminCompetitionTestimonials /></ProtectedAdminRoute>} />
          <Route path="competition/testimonials/add" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW}><AddCompetitionTestimonial /></ProtectedAdminRoute>} />
          <Route path="competition/testimonials/edit/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW}><EditCompetitionTestimonial /></ProtectedAdminRoute>} />
          <Route path="competition/testimonials/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW}><CompetitionTestimonialDetails /></ProtectedAdminRoute>} />
          <Route path="competition/candidates" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.COMPETITION_CANDIDATES_VIEW}><AdminCompetitionCandidates /></ProtectedAdminRoute>} />
          <Route path="competition/videos" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.VIDEO_VIEW}><AdminVideos /></ProtectedAdminRoute>} />
          <Route path="winners" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.WINNERS_VIEW}><AdminPreviousWinners /></ProtectedAdminRoute>} />
        </Route>


        {/* Catch all for main app if needed, or 404 */}
      </Routes>
    </Router>
  );
}

export default App;
