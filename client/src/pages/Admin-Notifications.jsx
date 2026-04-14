import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaCheck, FaTrashCan, FaRegCircle, FaBellSlash, FaUserPlus, FaEnvelope } from "react-icons/fa6";

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authorizationToken } = useAuth();

  const getNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/notifications", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/notifications/mark-read/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
        );
        toast.success("Marked as read");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/notifications/mark-all-read", {
        method: "PATCH",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
        toast.success("All caught up!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotif = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/notifications/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        toast.info("Notification removed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  if (loading) return <div className="admin-loading">Loading alerts...</div>;

  return (
    <section className="section-admin-notifications">
      <div className="admin-users-header">
        <div className="header-title-container">
          <h1 className="main-heading">Notifications</h1>
          <p>Manage your system alerts and messages</p>
        </div>
        <div className="header-right-container">
          {notifications.some((n) => !n.isRead) && (
            <button className="btn secondary-btn" onClick={markAllAsRead}>
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="admin-table-container">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <FaBellSlash style={{ fontSize: "5rem", opacity: 0.2, marginBottom: "2rem" }} />
            <h3>No notifications found</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
              >
                <div className="notif-content">
                  <div className="notif-icon">
                    {notif.type === "registration" ? (
                      <FaUserPlus className="reg-icon-type" />
                    ) : (
                      <FaEnvelope className="msg-icon-type" />
                    )}
                  </div>
                  <div className="notif-text">
                    <h4>{notif.username}</h4>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                  </div>
                </div>
                <div className="notif-actions">
                  {!notif.isRead && (
                    <button className="notif-btn read-btn" title="Mark as Read" onClick={() => markAsRead(notif._id)}>
                      <FaCheck />
                    </button>
                  )}
                  <button className="notif-btn delete-btn" title="Delete" onClick={() => deleteNotif(notif._id)}>
                    <FaTrashCan />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
