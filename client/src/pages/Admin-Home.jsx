import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { FaUser, FaRegListAlt, FaAddressBook, FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

export const AdminHome = () => {
    const [stats, setStats] = useState({
        users: 0,
        contacts: 0,
        services: 0,
        orders: 0,
    });
    const { user, authorizationToken } = useAuth();

    const getStats = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/stats", {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getStats();
    }, []);

    return (
        <section className="admin-home-section">
            <div className="container admin-welcome">
                <h1>Welcome Back, {user.username}!</h1>
                <p>Monitor your system's performance and manage your data from this central dashboard.</p>
            </div>

            <div className="container stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users-icon">
                        <FaUser />
                    </div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-count">{stats.users}</p>
                    </div>
                    <Link to="/admin/users" className="stat-link">
                        View All <FaArrowRight />
                    </Link>
                </div>

                <div className="stat-card">
                    <div className="stat-icon services-icon">
                        <FaRegListAlt />
                    </div>
                    <div className="stat-info">
                        <h3>Total Services</h3>
                        <p className="stat-count">{stats.services}</p>
                    </div>
                    <Link to="/admin/services" className="stat-link">
                        View All <FaArrowRight />
                    </Link>
                </div>

                <div className="stat-card">
                    <div className="stat-icon contacts-icon">
                        <FaAddressBook />
                    </div>
                    <div className="stat-info">
                        <h3>New Messages</h3>
                        <p className="stat-count">{stats.contacts}</p>
                    </div>
                    <Link to="/admin/contacts" className="stat-link">
                        View All <FaArrowRight />
                    </Link>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: "rgba(46, 204, 113, 0.15)" }}>
                        <FaShoppingCart style={{ color: "#2ecc71" }} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-count">{stats.orders}</p>
                    </div>
                    <Link to="/admin/orders" className="stat-link">
                        View All <FaArrowRight />
                    </Link>
                </div>
            </div>

            <div className="container quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/users/add" className="action-btn">Add New User</Link>
                    <Link to="/admin/services/add" className="action-btn">Add New Service</Link>
                    <Link to="/profile" className="action-btn">Edit Profile</Link>
                </div>
            </div>
        </section>
    );
};
