import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const Service = () => {
    const { services, isLoggedIn, authorizationToken, getServices } = useAuth();
    const [bookingLoading, setBookingLoading] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All",
        "General",
        "Web Development",
        "Mobile App Development",
        "Cloud Services",
        "Cyber Security",
        "Data Analytics",
        "UI/UX Design",
        "Digital Marketing"
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (getServices) {
                getServices(searchTerm, selectedCategory);
            }
        }, 400); // 400ms debounce
        
        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory]);

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

            {/* Added Search and Filter Controls */}
            <div className="container" style={{ marginTop: "4rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem", background: "rgba(255, 255, 255, 0.03)", padding: "2.4rem", borderRadius: "1.6rem", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    {/* Search Bar */}
                    <div style={{ position: "relative", width: "100%", maxWidth: "50rem" }}>
                        <input 
                            type="text" 
                            placeholder="Search by name, description, or provider..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "1.4rem 2rem", borderRadius: "3rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.5)", color: "var(--text-main)", fontSize: "1.6rem" }}
                        />
                    </div>
                    
                    {/* Category Filter Pills */}
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                style={{
                                    padding: "0.8rem 1.6rem",
                                    borderRadius: "2rem",
                                    fontSize: "1.4rem",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    border: selectedCategory === category ? "1px solid var(--primary-color)" : "1px solid rgba(255,255,255,0.1)",
                                    background: selectedCategory === category ? "var(--primary-color)" : "rgba(255, 255, 255, 0.05)",
                                    color: selectedCategory === category ? "#fff" : "var(--text-dim)"
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container grid grid-three-cols" style={{ marginTop: "4rem" }}>
                {services && services.length > 0 ? (
                    services.map((curElem) => {
                        const { _id, service, description, price, provider, category } = curElem;
                        const isLoading = bookingLoading[_id];
                        return (
                            <div className="card service-card" key={_id}>
                                <div className="card-img">
                                    <img
                                        src={curElem.image ? `http://localhost:5000${curElem.image}` : "/images/design.png"}
                                        alt={service}
                                        width="200"
                                    />
                                </div>
                                <div className="card-details">
                                    <div className="grid grid-two-cols" style={{alignItems: 'center'}}>
                                        <p>{provider}</p>
                                        <p style={{ color: "var(--primary-color)", fontWeight: "700", textAlign: "right" }}>{price}</p>
                                    </div>
                                    <span style={{display: 'inline-block', marginTop: '0.8rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '1.2rem', color: 'var(--text-dim)'}}>
                                        {category || "General"}
                                    </span>
                                    <h2 style={{marginTop: "1rem"}}>{service}</h2>
                                    <p>{description}</p>
                                </div>
                                <div className="service-card-action">
                                    <button
                                        className="btn"
                                        style={{ width: "100%", marginTop: "1.6rem" }}
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