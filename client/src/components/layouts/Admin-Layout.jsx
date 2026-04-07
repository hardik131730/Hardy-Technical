import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { FaUser, FaHome, FaRegListAlt, FaAddressBook } from "react-icons/fa";

export const AdminLayout = () => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
      return <Navigate to="/login" />
  }

  if (user && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="adminContainer">
      <header className="admin-header">
        <nav className="adminNav">
          <ul>
            <li>
              <NavLink to="/admin/users"><FaUser /> Users</NavLink>
            </li>
            <li>
              <NavLink to="/admin/contacts"><FaAddressBook /> Contacts</NavLink>
            </li>
            <li>
              <NavLink to="/admin/services"><FaRegListAlt /> Services</NavLink>
            </li>
            <li>
              <NavLink to="/"><FaHome /> Home</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
