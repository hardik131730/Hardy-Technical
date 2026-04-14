import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { FaUser, FaUserCircle, FaRegListAlt, FaAddressBook, FaHome, FaBars, FaTimes, FaBell, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import socket from "../../socket";
import { toast } from "react-toastify";

export const AdminLayout = () => {
  const { user, isLoading, authorizationToken } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/notifications", {
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      if (response.ok) {
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.log("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    if (user.isAdmin) fetchUnreadCount();

    // Listen for real-time contact messages
    socket.on("new_contact_message", (data) => {
      fetchUnreadCount(); 
      toast.info(`New message from ${data.username}!`, { position: "top-right", theme: "dark" });
    });

    // Listen for real-time user registrations
    socket.on("new_user_registration", (data) => {
      fetchUnreadCount();
      toast.success(`Welcome our new user: ${data.username}!`, { position: "top-right", theme: "dark" });
    });

    // Listen for new service bookings
    socket.on("new_order", (data) => {
      fetchUnreadCount();
      toast.info(`📦 ${data.username} booked "${data.serviceName}"`, { position: "top-right", theme: "dark" });
    });

    // Click outside listener for profile dropdown
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      socket.off("new_contact_message");
      socket.off("new_user_registration");
      socket.off("new_order");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="adminContainer">
      {/* Unified Top Header */}
      <div className="admin-top-bar">
        <div className="admin-logo">
          <span className="brand-name">HardyTechnical</span>
          <span className="admin-tag">Admin Panel</span>
        </div>

        <div className="admin-header-right">
          <div className="admin-notification-icon" onClick={() => navigate("/admin/notifications")}>
            <FaBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </div>
          
          <div className="admin-profile-container" ref={profileRef}>
            <div className="admin-profile-toggle" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              {user?.image ? (
                <img src={`http://localhost:5000${user.image}`} alt="Profile" className="header-avatar" />
              ) : (
                <FaUserCircle className="default-avatar-icon" />
              )}
            </div>

            {isProfileOpen && (
              <div className="admin-profile-dropdown">
                <div className="dropdown-header">
                  <h4>{user?.username || "Admin"}</h4>
                  <p>{user?.email || "admin@example.com"}</p>
                </div>
                <div className="dropdown-body">
                  <NavLink to="/profile" onClick={() => setIsProfileOpen(false)} className="dropdown-item">
                    <FaUserCircle /> My Profile
                  </NavLink>
                  <NavLink to="/logout" onClick={() => setIsProfileOpen(false)} className="dropdown-item logout">
                    <FaSignOutAlt /> Logout
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          <div className="admin-mobile-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <header className={`admin-header ${isSidebarOpen ? "active" : ""}`}>
        <nav className="adminNav">
          <ul>
            <li>
              <NavLink to="/admin" end onClick={closeSidebar}><FaHome /> Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" onClick={closeSidebar}><FaUser /> Users</NavLink>
            </li>
            <li>
              <NavLink to="/admin/contacts" onClick={closeSidebar}><FaAddressBook /> Contacts</NavLink>
            </li>
            <li>
              <NavLink to="/admin/services" onClick={closeSidebar}><FaRegListAlt /> Services</NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" onClick={closeSidebar}><FaShoppingCart /> Orders</NavLink>
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
