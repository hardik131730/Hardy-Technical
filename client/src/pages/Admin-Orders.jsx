import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaTrash, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, FaBoxOpen, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

const STATUS_OPTIONS = ["Pending", "Processing", "Completed", "Cancelled"];
const STATUS_COLORS = {
    Pending:    "#f39c12",
    Processing: "#3498db",
    Completed:  "#2ecc71",
    Cancelled:  "#ff4757",
};

export const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const { authorizationToken } = useAuth();

    const fetchOrders = async (status = "") => {
        setLoading(true);
        try {
            const url = `http://localhost:5000/api/admin/orders${status ? `?status=${status}` : ""}`;
            const response = await fetch(url, { headers: { Authorization: authorizationToken } });
            const data = await response.json();
            if (response.ok) setOrders(data.orders || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/orders/status/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: authorizationToken },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();
            if (response.ok) {
                setOrders((prev) =>
                    prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
                );
                toast.success(`Order status updated to "${newStatus}"`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/orders/delete/${orderId}`, {
                method: "DELETE",
                headers: { Authorization: authorizationToken },
            });
            if (response.ok) {
                setOrders((prev) => prev.filter((o) => o._id !== orderId));
                toast.info("Order deleted.");
            }
        } catch (error) {
            toast.error("Failed to delete order.");
        }
    };

    const getExportData = async () => {
        try {
            setIsExporting(true);
            const response = await fetch(`http://localhost:5000/api/admin/orders/export?status=${filterStatus}`, {
                method: "GET",
                headers: { Authorization: authorizationToken },
            });
            const data = await response.json();
            setIsExporting(false);
            return data;
        } catch (error) {
            console.error(error);
            setIsExporting(false);
            toast.error("Failed to fetch data for export");
            return null;
        }
    };

    const handleExportCSV = async () => {
        const data = await getExportData();
        if (data) {
            const exportData = data.map(order => ({
                Customer: order.username,
                Email: order.email,
                Service: order.serviceName,
                Provider: order.serviceProvider,
                Price: order.servicePrice,
                Date: new Date(order.createdAt).toLocaleDateString("en-IN"),
                Status: order.status
            }));
            exportToCSV(exportData, "orders-list.csv");
            toast.success("Orders exported to CSV");
        }
    };

    const handleExportPDF = async () => {
        const data = await getExportData();
        if (data) {
            const headers = ["Customer", "Service", "Provider", "Price", "Date", "Status"];
            const rows = data.map(order => [
                order.username,
                order.serviceName,
                order.serviceProvider,
                order.servicePrice,
                new Date(order.createdAt).toLocaleDateString("en-IN"),
                order.status
            ]);
            exportToPDF(headers, rows, "orders-list.pdf", "Admin Orders List");
            toast.success("Orders exported to PDF");
        }
    };

    useEffect(() => { fetchOrders(filterStatus); }, [filterStatus]);

    return (
        <section className="section-admin-orders">
            <div className="admin-users-header">
                <div className="header-title-container">
                    <h1 className="main-heading">Orders</h1>
                    <p>Manage all service bookings and update their statuses</p>
                </div>
                <div className="header-right-container" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div className="export-actions" style={{ display: "flex", gap: "10px" }}>
                        <button 
                            className="secondary-btn" 
                            onClick={handleExportCSV} 
                            disabled={isExporting}
                            title="Export to CSV"
                            style={{ padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}
                        >
                            {isExporting ? <FaSpinner className="spin" /> : <FaFileCsv />}
                            <span className="btn-text-resp">CSV</span>
                        </button>
                        <button 
                            className="secondary-btn" 
                            onClick={handleExportPDF} 
                            disabled={isExporting}
                            title="Export to PDF"
                            style={{ padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}
                        >
                            {isExporting ? <FaSpinner className="spin" /> : <FaFilePdf />}
                            <span className="btn-text-resp">PDF</span>
                        </button>
                    </div>
                    <select
                        className="status-filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Orders</option>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <div style={{ textAlign: "center", padding: "5rem", fontSize: "1.8rem" }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="no-notifications" style={{ textAlign: "center", padding: "6rem" }}>
                        <FaBoxOpen style={{ fontSize: "5rem", opacity: 0.2, marginBottom: "2rem" }} />
                        <h3>No orders found</h3>
                        <p>Orders will appear here when users book services.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Provider</th>
                                <th>Price</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const color = STATUS_COLORS[order.status] || "#888";
                                return (
                                    <tr key={order._id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{order.username}</div>
                                            <div style={{ fontSize: "1.2rem", color: "var(--text-dim)" }}>{order.email}</div>
                                        </td>
                                        <td>{order.serviceName}</td>
                                        <td>{order.serviceProvider}</td>
                                        <td style={{ color: "var(--primary-color)", fontWeight: 700 }}>{order.servicePrice}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                                        <td>
                                            <select
                                                className="order-status-select"
                                                value={order.status}
                                                disabled={updatingId === order._id}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                style={{ borderColor: color, color: color }}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="notif-btn delete-btn"
                                                title="Delete Order"
                                                onClick={() => handleDelete(order._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
};
