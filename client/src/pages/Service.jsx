import { useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const Service = () => {
    const { services, isLoggedIn, authorizationToken } = useAuth();
    const [bookingLoading, setBookingLoading] = useState({});

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

            <div className="container grid grid-three-cols" style={{ marginTop: "4rem" }}>
                {services.map((curElem) => {
                    const { _id, service, description, price, provider } = curElem;
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
                                <div className="grid grid-two-cols">
                                    <p>{provider}</p>
                                    <p style={{ color: "var(--primary-color)", fontWeight: "700" }}>{price}</p>
                                </div>
                                <h2>{service}</h2>
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
                })}
            </div>
        </section>
    );
};