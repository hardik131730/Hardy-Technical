import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const AdminAddUser = () => {
    const [data, setData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
    });

    const navigate = useNavigate();
    const { authorizationToken } = useAuth();

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setData({
            ...data,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if (response.ok) {
                toast.success(responseData.message || "User added successfully");
                setData({ username: "", email: "", phone: "", password: "" });
                navigate("/admin/users");
            } else {
                toast.error(responseData.message || "Failed to add user");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="section-contact">
            <div className="contact-content container">
                <h1 className="main-heading">Add New User</h1>
            </div>
            <div className="container grid grid-two-cols">
                <section className="section-form">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                autoComplete="off"
                                value={data.username}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email">email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="off"
                                value={data.email}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone">phone</label>
                            <input
                                type="phone"
                                name="phone"
                                id="phone"
                                autoComplete="off"
                                value={data.phone}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="new-password"
                                value={data.password}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div className="btn-group" style={{ display: "flex", gap: "1.6rem", marginTop: "3.2rem" }}>
                            <button type="submit" className="btn" style={{ flex: 1, marginTop: 0 }}>Add User</button>
                            <button type="button" className="btn secondary-btn" style={{ flex: 1 }} onClick={() => navigate("/admin/users")}>Cancel</button>
                        </div>
                    </form>
                </section>
            </div>
        </section>
    );
};
