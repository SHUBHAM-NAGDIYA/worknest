import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OwnerRegisterPage  from "./pages/OwnerRegistration";
import OwnerDashboard from "./pages/OwnerDashboard";
import CreateAdmin from "./pages/CreateAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateMember from "./pages/CreateMember";
import MemberDashboard from "./pages/MemberDashboard";
import PricingPage from "./pages/PricingPage";
import ManageSubscriptions from "./pages/ManageSubscriptions";
import CreateTeam from "./pages/CreateTeam";
import CreateProject from "./pages/CreateProject";
import ProjectList  from "./pages/ProjectList";
import TeamProjectPage from "./pages/TeamProjectManager";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LoginPage" element={<LoginPage />} ></Route>
        <Route path="/OwnerRegistration" element={<OwnerRegisterPage />} ></Route>
        <Route path="/OwnerDashboard" element={<OwnerDashboard />} ></Route>
        <Route path="/CreateAdmin" element={<CreateAdmin />} ></Route>
        <Route path="/AdminDashboard" element={<AdminDashboard />} ></Route>
        <Route path="/CreateMember" element={<CreateMember />} ></Route>
        <Route path="/MemberDashboard" element={<MemberDashboard />} ></Route>
        <Route path="/PricingPage" element={<PricingPage/>} ></Route>
        <Route path="/ManageSubscriptions" element={<ManageSubscriptions/>} ></Route>
        <Route path="/CreateTeam" element={<CreateTeam/>} ></Route>
        <Route path="/CreateProject" element={<CreateProject/>} ></Route>
        <Route path="/ProjectList" element={<ProjectList/>} ></Route>
        <Route path="/TeamProjectManager" element={<TeamProjectPage/>} ></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;








/*
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import CreateAdmin from "./pages/owner/CreateAdmin";
import ManageSubscription from "./pages/owner/ManageSubscription";
import ViewUsage from "./pages/owner/ViewUsage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateMember from "./pages/admin/CreateMember";
import CreateTeam from "./pages/admin/CreateTeam";
import AddMemberToTeam from "./pages/admin/AddMemberToTeam";

// Work Management Pages
import CreateProject from "./pages/project/CreateProject";
import ProjectList from "./pages/project/ProjectList";
import TaskBoard from "./pages/project/TaskBoard";
import CreateTask from "./pages/project/CreateTask";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/create-admin" element={<CreateAdmin />} />
        <Route path="/owner/manage-subscription" element={<ManageSubscription />} />
        <Route path="/owner/view-usage" element={<ViewUsage />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-member" element={<CreateMember />} />
        <Route path="/admin/create-team" element={<CreateTeam />} />
        <Route path="/admin/add-member-to-team" element={<AddMemberToTeam />} />


        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/project/:projectId" element={<TaskBoard />} />
        <Route path="/project/:projectId/create-task" element={<CreateTask />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;*/