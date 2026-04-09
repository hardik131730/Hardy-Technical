import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const AdminAddService = () => {
    const [data, setData] = useState({
        service: "",
        price: "",
        description: "",
        provider: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const { authorizationToken } = useAuth();
    const navigate = useNavigate();

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...data,
            [name]: value,
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("service", data.service);
            formData.append("price", data.price);
            formData.append("description", data.description);
            formData.append("provider", data.provider);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await fetch("http://localhost:5000/api/admin/services/add", {
                method: "POST",
                headers: {
                    Authorization: authorizationToken,
                },
                body: formData,
            });

            const responseData = await response.json();

            if (response.ok) {
                toast.success(responseData.message || "Service Added Successfully");
                setData({ service: "", price: "", description: "", provider: "" });
                setImageFile(null);
                setImagePreview(null);
                navigate("/admin/services");
            } else {
                toast.error(responseData.message || "Failed to add service");
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="section-contact">
            <div className="contact-content container">
                <h1 className="main-heading">Add New Service</h1>
            </div>
            <div className="container grid grid-two-cols">
                <section className="section-form">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="service">Service Name</label>
                            <input
                                type="text"
                                name="service"
                                id="service"
                                autoComplete="off"
                                placeholder="e.g. Web Development"
                                value={data.service}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input
                                type="text"
                                name="price"
                                id="price"
                                autoComplete="off"
                                placeholder="e.g. $299/month"
                                value={data.price}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                autoComplete="off"
                                placeholder="Brief description of the service"
                                value={data.description}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="provider">Provider</label>
                            <input
                                type="text"
                                name="provider"
                                id="provider"
                                autoComplete="off"
                                placeholder="e.g. John Doe"
                                value={data.provider}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="image">Service Image</label>
                            <div
                                className="image-upload-area"
                                onClick={() => fileInputRef.current.click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                ) : (
                                    <div className="image-upload-placeholder">
                                        <span className="upload-icon">📷</span>
                                        <p>Click to upload image</p>
                                        <small>JPEG, PNG, WebP (max 5MB)</small>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-submit">Add Service</button>
                        </div>
                    </form>
                </section>
                <div className="service-form-preview">
                    <h2>Service Preview</h2>
                    <div className="preview-card">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Service" className="preview-card-img" />
                        ) : (
                            <div className="preview-card-img-placeholder">
                                <span>No image selected</span>
                            </div>
                        )}
                        <div className="preview-card-body">
                            <h3>{data.service || "Service Name"}</h3>
                            <p className="preview-price">{data.price || "Price"}</p>
                            <p className="preview-description">{data.description || "Service description will appear here."}</p>
                            <p className="preview-provider">By: {data.provider || "Provider Name"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
