import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";
import StaffHome from "./pages/staff/StaffHome.jsx";
import MemberHome from "./pages/member/MemberHome.jsx";
import Members from "./pages/admin/Members.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Staff from "./pages/admin/Staff.jsx";
import Plans from "./pages/admin/Plans.jsx";
import CheckIn from "./pages/staff/CheckIn.jsx";
import Attendance from "./pages/staff/Attendance.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={["admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <ProtectedRoute allow={["staff"]}>
            <StaffHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member"
        element={
          <ProtectedRoute allow={["member"]}>
            <MemberHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/members"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Members />
          </ProtectedRoute>
        }
      />
            <Route
        path="/admin/plans"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Plans />
          </ProtectedRoute>
        }
      />
            <Route
        path="/admin/staff"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Staff />
          </ProtectedRoute>
        }
        
      />
            <Route
        path="/staff/checkin"
        element={
          <ProtectedRoute allow={["staff"]}>
            <CheckIn />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/attendance"
        element={
          <ProtectedRoute allow={["staff"]}>
            <Attendance />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
      
    </Routes>
  );
}