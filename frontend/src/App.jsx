// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

// Layouts
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminSidebar";

// Auth + Home
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Farmer
import FarmerDashboard from "./pages/FarmerDashboard";
import MachineList from "./pages/MachineList";
import BookingPage from "./pages/BookingPage";
import BookingStatus from "./pages/BookingStatus";
import AddReview from "./pages/AddReview";
import MachineDetails from "./pages/MachineDetails";
import FarmerWallet from "./pages/FarmerWallet";

// Owner
import OwnerDashboard from "./pages/OwnerDashboard";
import AddMachine from "./pages/AddMachine";
import OwnerBookings from "./pages/OwnerBookings";
import OwnerEarnings from "./pages/OwnerEarnings";
import OwnerAnalytics from "./pages/OwnerAnalytics";

// Profile
import Profile from "./pages/Profile";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminMachines from "./pages/AdminMachines";

import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />       {/* <-- HOME PAGE */}
        <Route path="/home" element={<Home />} />   {/* <-- HOME PAGE */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* PROTECTED FARMER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/farmer/dashboard"
            element={<MainLayout><FarmerDashboard /></MainLayout>}
          />

          <Route
            path="/farmer/machines"
            element={<MainLayout><MachineList /></MainLayout>}
          />

          <Route
            path="/farmer/book/:id"
            element={<MainLayout><BookingPage /></MainLayout>}
          />

          <Route
            path="/farmer/bookings"
            element={<MainLayout><BookingStatus /></MainLayout>}
          />

          <Route
            path="/farmer/review/:machineId"
            element={<MainLayout><AddReview /></MainLayout>}
          />

          <Route
            path="/farmer/wallet"
            element={<MainLayout><FarmerWallet /></MainLayout>}
          />
        </Route>


        {/* SHARED MACHINE DETAILS */}
        <Route
          path="/machine/:id"
          element={<MainLayout><MachineDetails /></MainLayout>}
        />


        {/* PROTECTED OWNER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/owner/dashboard"
            element={<MainLayout><OwnerDashboard /></MainLayout>}
          />

          <Route
            path="/owner/add-machine"
            element={<MainLayout><AddMachine /></MainLayout>}
          />

          <Route
            path="/owner/bookings"
            element={<MainLayout><OwnerBookings /></MainLayout>}
          />

          <Route
            path="/owner/earnings"
            element={<MainLayout><OwnerEarnings /></MainLayout>}
          />

          <Route
            path="/owner/analytics"
            element={<MainLayout><OwnerAnalytics /></MainLayout>}
          />
        </Route>


        {/* PROFILE */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile"
            element={<MainLayout><Profile /></MainLayout>}
          />
        </Route>


        {/* ADMIN ROUTES */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="machines" element={<AdminMachines />} />
          </Route>
        </Route>


        {/* FALLBACK */}
        <Route path="*" element={<Home />} />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}
