import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const res_data = await response.json();

            if (response.ok) {
                toast.success(res_data.message);
                setStep(2); // Move to verify OTP step
            } else {
                toast.error(res_data.message);
            }
        } catch (error) {
            console.error("Error requesting OTP", error);
            toast.error("Failed to connect to the server.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const res_data = await response.json();

            if (response.ok) {
                toast.success(res_data.message);
                navigate("/login");
            } else {
                toast.error(res_data.message);
            }
        } catch (error) {
            console.error("Error resetting password", error);
            toast.error("Failed to connect to the server.");
        }
    };

    return (
        <section>
            <main>
                <div className="section-registration">
                    <div className="container grid grid-two-cols">
                        <div className="registration-image">
                            <img 
                                src="/images/login.png" 
                                alt="Secure password reset interface"
                                width="500"
                            />
                        </div>

                        <div className="registration-form">
                            <h1 className="main-heading mb-3">Reset Password</h1>
                            <br />

                            {step === 1 ? (
                                <form onSubmit={handleRequestOtp}>
                                    <p style={{ marginBottom: "2rem", color: "var(--text-dim)", fontSize: "1.6rem" }}>
                                        Enter your email address and we'll send you a 6-digit OTP to reset your password.
                                    </p>
                                    <div>
                                        <label htmlFor="email">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Enter your email" 
                                            id="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <br />
                                    <button type="submit" className="btn btn-submit">Send OTP</button>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword}>
                                    <p style={{ marginBottom: "2rem", color: "#2ecc71", fontSize: "1.4rem" }}>
                                        OTP sent! Please check your email inbox (and spam folder).
                                    </p>
                                    <div>
                                        <label htmlFor="otp">6-Digit OTP</label>
                                        <input 
                                            type="text" 
                                            name="otp" 
                                            placeholder="Enter the OTP from your email" 
                                            id="otp" 
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            maxLength={6}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword">New Password</label>
                                        <input 
                                            type="password" 
                                            name="newPassword" 
                                            placeholder="Enter your new password" 
                                            id="newPassword" 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <br />
                                    <button type="submit" className="btn btn-submit">Reset Password</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </section>
    );
};
