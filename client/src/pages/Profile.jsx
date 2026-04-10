import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const Profile = () => {
    const { user, authorizationToken } = useAuth();

    const [formData, setFormData] = useState({
        username: user?.username || "",
        phone: user?.phone || "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        user?.image ? `http://localhost:5000${user.image}` : null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("username", formData.username);
            data.append("phone", formData.phone);
            if (imageFile) {
                data.append("image", imageFile);
            }

            const response = await fetch("http://localhost:5000/api/auth/user/update-profile", {
                method: "PATCH",
                headers: {
                    Authorization: authorizationToken,
                },
                body: data,
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message || "Profile updated successfully!");
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const initials = user?.username
        ? user.username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <section className="profile-section">
            <div className="container">
                <h1 className="main-heading">My Profile</h1>
            </div>
            <div className="container profile-container">
                {/* Profile Sidebar */}
                <div className="profile-sidebar">
                    <div className="profile-avatar-wrapper" onClick={() => fileInputRef.current.click()}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="profile-avatar-img" />
                        ) : (
                            <div className="profile-avatar-initials">
                                <span>{initials}</span>
                            </div>
                        )}
                        <div className="profile-avatar-overlay">
                            <span>📷 Change</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />
                    <h2 className="profile-name">{user?.username || "User"}</h2>
                    <p className="profile-email">{user?.email}</p>
                    {user?.isAdmin && <span className="profile-badge">Admin</span>}
                    
                    <div className="profile-sidebar-actions">
                        <NavLink to="/logout" className="btn btn-logout">Logout</NavLink>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="profile-form-container">
                    <div className="profile-form-header">
                        <h2>Edit Profile</h2>
                        <p>Keep your contact details up to date</p>
                    </div>
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="username">Full Name</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInput}
                                placeholder="e.g. Hardik Gajjar"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={user?.email || ""}
                                disabled
                                title="Email cannot be changed"
                            />
                            <small className="info-text">Email address is managed by the system and cannot be changed.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInput}
                                placeholder="e.g. +91 90457 38450"
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
