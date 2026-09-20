
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Common Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Authentication Pages
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import AdminLogin from "./auth/AdminLogin";

// User Pages
import Dashboard from "./user/Dashboard";
import Scores from "./user/Scores";
import Subscription from "./user/Subscription";
import Charity from "./user/Charity";
import Draws from "./user/Draws";
import Winnings from "./user/Winnings";
import Profile from "./user/Profile";

// Admin Pages
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import ManageSubscriptions from "./admin/ManageSubscriptions";
import ManageDraws from "./admin/ManageDraws";
import ManageCharities from "./admin/ManageCharities";
import ManageWinners from "./admin/ManageWinners";
import Analytics from "./admin/Analytics";

// Public Pages
import Home from "./pages/public-pages/Home";
import Pricing from "./pages/public-pages/Pricing";
import Charities from "./pages/public-pages/Charities";
import CharityDetails from "./pages/public-pages/CharityDetails";

function NotFound() {
    return (
        <div className="not-found-page">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
}

function AppContent() {
    const location = useLocation();

    // Hide normal Navbar and Footer on all admin routes
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <div className="app">
            {/* Normal Navbar only for public and user pages */}
            {!isAdminPage && <Navbar />}

            <main className={isAdminPage ? "" : "main-content"}>
                <Routes>
                    {/* ================= PUBLIC ROUTES ================= */}

                    <Route path="/" element={<Home />} />

                    <Route
                        path="/pricing"
                        element={<Pricing />}
                    />

                    <Route
                        path="/charities"
                        element={<Charities />}
                    />

                    <Route
                        path="/charities/:id"
                        element={<CharityDetails />}
                    />

                    {/* ================= AUTH ROUTES ================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Signup />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    {/* Admin login is outside protected routes */}
                    <Route
                        path="/admin/login"
                        element={<AdminLogin />}
                    />

                    {/* ================= USER PROTECTED ROUTES ================= */}

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/scores"
                            element={<Scores />}
                        />

                        <Route
                            path="/subscription"
                            element={<Subscription />}
                        />

                        <Route
                            path="/charity"
                            element={<Charity />}
                        />

                        <Route
                            path="/draws"
                            element={<Draws />}
                        />

                        <Route
                            path="/winnings"
                            element={<Winnings />}
                        />
                    </Route>

                    {/* ================= ADMIN PROTECTED ROUTES ================= */}

                    <Route element={<ProtectedRoute adminOnly />}>
                        {/* Admin Layout includes Sidebar and Outlet */}
                        <Route element={<AdminLayout />}>
                            {/* Admin Dashboard */}
                            <Route
                                path="/admin/dashboard"
                                element={<AdminDashboard />}
                            />

                            {/* User Management */}
                            <Route
                                path="/admin/users"
                                element={<ManageUsers />}
                            />

                            {/* Subscription Management */}
                            <Route
                                path="/admin/subscriptions"
                                element={<ManageSubscriptions />}
                            />

                            {/* Draw Management */}
                            <Route
                                path="/admin/draws"
                                element={<ManageDraws />}
                            />

                            {/* Charity Management */}
                            <Route
                                path="/admin/charities"
                                element={<ManageCharities />}
                            />

                            {/* Winner Management */}
                            <Route
                                path="/admin/winners"
                                element={<ManageWinners />}
                            />

                            {/* Analytics */}
                            <Route
                                path="/admin/analytics"
                                element={<Analytics />}
                            />
                        </Route>
                    </Route>

                    {/* ================= 404 ROUTE ================= */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </main>

            {/* Normal Footer only for public and user pages */}
            {!isAdminPage && <Footer />}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;