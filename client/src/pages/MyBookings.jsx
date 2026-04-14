import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaCalendarCheck, FaTimesCircle, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
    Pending:    { color: "#f39c12", icon: <FaClock />,        label: "Pending" },
    Processing: { color: "#3498db", icon: <FaSpinner />,      label: "Processing" },
    Completed:  { color: "#2ecc71", icon: <FaCheckCircle />,  label: "Completed" },
    Cancelled:  { color: "#ff4757", icon: <FaTimesCircle />,  label: "Cancelled" },
};

export const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authorizationToken } = useAuth();

    const fetchBookings = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/orders/my-bookings", {
                headers: { Authorization: authorizationToken },
            });
            const data = await response.json();
            if (response.ok) setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleCancel = async (id, serviceName) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/cancel/${id}`, {
                method: "PATCH",
                headers: { Authorization: authorizationToken },
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(`Booking for "${serviceName}" cancelled.`);
                setBookings((prev) =>
                    prev.map((order) => order._id === id ? { ...order, status: "Cancelled" } : order)
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong.");
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    if (loading) return <div style={{ textAlign: "center", padding: "10rem", fontSize: "2rem" }}>Loading your bookings...</div>;

    return (
        <section className="section-my-bookings">
            <div className="container">
                <div className="my-bookings-header">
                    <div>
                        <h1 className="main-heading">My Bookings</h1>
                        <p style={{ color: "var(--text-dim)", marginTop: "0.8rem", fontSize: "1.6rem" }}>
                            Track and manage all your service bookings
                        </p>
                    </div>
                    <Link to="/service" className="btn secondary-btn" style={{ fontSize: "1.4rem" }}>
                        Book a Service
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="no-bookings-state">
                        <FaCalendarCheck style={{ fontSize: "6rem", opacity: 0.2, marginBottom: "2rem" }} />
                        <h3>No bookings yet</h3>
                        <p>You haven't booked any services. Explore our services to get started!</p>
                        <Link to="/service" className="btn" style={{ marginTop: "2rem" }}>
                            Browse Services
                        </Link>
                    </div>
                ) : (
                    <div className="booking-list">
                        {bookings.map((order) => {
                            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                            const canCancel = order.status === "Pending";
                            return (
                                <div key={order._id} className="booking-card">
                                    <div className="booking-info">
                                        <div className="booking-service-name">
                                            <h3>{order.serviceName}</h3>
                                            <p className="booking-provider">by {order.serviceProvider}</p>
                                        </div>
                                        <div className="booking-meta">
                                            <span className="booking-price">{order.servicePrice}</span>
                                            <span
                                                className="booking-status-badge"
                                                style={{ background: `${cfg.color}20`, color: cfg.color, borderColor: `${cfg.color}40` }}
                                            >
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="booking-footer">
                                        <small style={{ color: "var(--text-dim)" }}>
                                            Booked on: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </small>
                                        {canCancel && (
                                            <button
                                                className="cancel-booking-btn"
                                                onClick={() => handleCancel(order._id, order.serviceName)}
                                            >
                                                <FaTimesCircle /> Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
