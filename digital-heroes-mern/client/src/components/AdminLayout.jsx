
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main-content">
                <Outlet />
            </main>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
    .admin-layout {
        min-height: 100vh;
        background: #f3f4f6;
    }

    .admin-main-content {
        min-height: 100vh;
        margin-left: 260px;
        padding: 20px;
        box-sizing: border-box;
    }

    @media (max-width: 768px) {
        .admin-main-content {
            margin-left: 220px;
            padding: 15px;
        }
    }
`;

export default AdminLayout;