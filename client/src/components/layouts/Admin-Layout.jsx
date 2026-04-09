import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { FaUser, FaUserCircle, FaRegListAlt, FaAddressBook } from "react-icons/fa";

export const AdminLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!user.isAdmin) {
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
              <NavLink to="/profile"><FaUserCircle /> Profile</NavLink>
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
