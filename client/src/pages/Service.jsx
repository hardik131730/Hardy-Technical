import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const Service = () => {
    const { services, isLoggedIn, authorizationToken, getServices } = useAuth();
    const [bookingLoading, setBookingLoading] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (getServices) {
                getServices(searchTerm);
            }
        }, 400); // 400ms debounce
        
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleBooking = async (serviceId, serviceName) => {
        if (!isLoggedIn) {
            toast.info("Please login to book a service.");
            return;
        }

        setBookingLoading((prev) => ({ ...prev, [serviceId]: true }));
        try {
            const response = await fetch("http://localhost:5000/api/orders/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify({ serviceId }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(`"${serviceName}" booked successfully!`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setBookingLoading((prev) => ({ ...prev, [serviceId]: false }));
        }
    };

    return (
        <section className="section-services" style={{ padding: "60px 0 0 0" }}>
            <div className="container">
                <h1 className="main-heading">Services</h1>
                <p style={{ color: "var(--text-dim)", fontSize: "1.8rem", marginTop: "1rem", maxWidth: "80rem" }}>
                    Explore our range of high-quality IT services. We provide innovative solutions tailored to meet your unique business requirements.
                </p>
                {isLoggedIn && (
                    <div style={{ marginTop: "1.6rem" }}>
                        <Link to="/my-bookings" className="btn secondary-btn" style={{ fontSize: "1.4rem", padding: "1rem 2rem" }}>
                            My Bookings →
                        </Link>
                    </div>
                )}
            </div>

            {/* Compact Search Section */}
            <div className="container" style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
                <div style={{ 
                    width: "100%", 
                    maxWidth: "60rem",
                    position: "relative",
                    background: "rgba(255, 255, 255, 0.03)", 
                    padding: "1.2rem", 
                    borderRadius: "4rem", 
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
                }}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <div style={{ position: "absolute", left: "2rem", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                style={{ color: "var(--primary-color)", opacity: "0.9" }}
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search services..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                width: "100%", 
                                padding: "1.2rem 2rem 1.2rem 5rem", 
                                borderRadius: "3rem", 
                                border: "none", 
                                background: "rgba(0,0,0,0.2)", 
                                color: "#fff", 
                                fontSize: "1.5rem",
                                outline: "none",
                                transition: "all 0.3s ease"
                            }}
                            onFocus={(e) => e.target.parentElement.parentElement.style.borderColor = "var(--primary-color)"}
                            onBlur={(e) => e.target.parentElement.parentElement.style.borderColor = "rgba(255,255,255,0.08)"}
                        />
                    </div>
                </div>
            </div>

            {/* Tightened Service Counter */}
            <div className="container" style={{ marginTop: "1.6rem", textAlign: "center" }}>
                <p style={{ fontSize: "1.2rem", color: "var(--text-dim)", letterSpacing: "2px", textTransform: "uppercase", opacity: "0.6" }}>
                    {services.length} {services.length === 1 ? 'Service' : 'Services'} Available
                </p>
            </div>

            <div className="container grid grid-three-cols" style={{ marginTop: "4rem" }}>
                {services && services.length > 0 ? (
                    services.map((curElem) => {
                        const { _id, service, description, price, provider } = curElem;
                        const isLoading = bookingLoading[_id];
                        return (
                            <div className="card service-card" key={_id} style={{
                                borderRadius: "2rem",
                                overflow: "hidden",
                                background: "rgba(255, 255, 255, 0.02)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease"
                            }}>
                                <div className="card-img" style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                                    <img
                                        src={curElem.image ? `http://localhost:5000${curElem.image}` : "/images/design.png"}
                                        alt={service}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "0.8" }}
                                    />
                                    <div style={{ position: "absolute", top: "1.6rem", right: "1.6rem", background: "rgba(0,0,0,0.6)", padding: "0.6rem 1.2rem", borderRadius: "1rem", backdropFilter: "blur(5px)" }}>
                                        <p style={{ color: "var(--primary-color)", fontWeight: "700", fontSize: "1.4rem" }}>{price}</p>
                                    </div>
                                </div>
                                <div className="card-details" style={{ padding: "2.4rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                                        <p style={{ fontSize: "1.2rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary-color)" }}></span>
                                            {provider}
                                        </p>
                                    </div>
                                    <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem", color: "#fff" }}>{service}</h2>
                                    <p style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", marginBottom: "2rem", minHeight: "4.2rem" }}>{description}</p>
                                    
                                    <button
                                        className="btn"
                                        style={{ 
                                            width: "100%", 
                                            padding: "1.2rem", 
                                            borderRadius: "1.5rem",
                                            fontWeight: "600",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                                        }}
                                        onClick={() => handleBooking(_id, service)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Booking..." : isLoggedIn ? "Book Now" : "Login to Book"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--text-dim)", fontSize: "1.8rem" }}>
                        No services found matching your criteria.
                    </div>
                )}
            </div>
        </section>
    );
};