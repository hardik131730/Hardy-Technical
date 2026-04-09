import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const AdminServiceUpdate = () => {
    const [data, setData] = useState({
        service: "",
        description: "",
        price: "",
        provider: "",
        image: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const params = useParams();
    const navigate = useNavigate();
    const { authorizationToken } = useAuth();

    const getSingleServiceData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/services/${params.id}`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            const serviceData = await response.json();
            if (response.ok) {
                setData(serviceData);
                if (serviceData.image) {
                    setImagePreview(`http://localhost:5000${serviceData.image}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getSingleServiceData();
    }, []);

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setData({ ...data, [name]: value });
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
        try {
            const formData = new FormData();
            formData.append("service", data.service);
            formData.append("price", data.price);
            formData.append("description", data.description);
            formData.append("provider", data.provider);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await fetch(`http://localhost:5000/api/admin/services/update/${params.id}`, {
                method: "PATCH",
                headers: {
                    Authorization: authorizationToken,
                },
                body: formData,
            });

            if (response.ok) {
                toast.success("Updated successfully");
                navigate("/admin/services");
            } else {
                toast.error("Not updated");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="section-contact">
            <div className="contact-content container">
                <h1 className="main-heading">Update Service Data</h1>
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
                                value={data.price}
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
                                value={data.provider}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                autoComplete="off"
                                value={data.description}
                                onChange={handleInput}
                                required
                                cols="30"
                                rows="5"
                            />
                        </div>
                        <div>
                            <label>Service Image</label>
                            <div
                                className="image-upload-area"
                                onClick={() => fileInputRef.current.click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                ) : (
                                    <div className="image-upload-placeholder">
                                        <span className="upload-icon">📷</span>
                                        <p>Click to upload a new image</p>
                                        <small>JPEG, PNG, WebP (max 5MB)</small>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-submit">Update Service</button>
                        </div>
                    </form>
                </section>
                <div className="service-form-preview">
                    <h2>Current Preview</h2>
                    <div className="preview-card">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Service" className="preview-card-img" />
                        ) : (
                            <div className="preview-card-img-placeholder">
                                <span>No image</span>
                            </div>
                        )}
                        <div className="preview-card-body">
                            <h3>{data.service || "Service Name"}</h3>
                            <p className="preview-price">{data.price || "Price"}</p>
                            <p className="preview-description">{data.description || "Description"}</p>
                            <p className="preview-provider">By: {data.provider || "Provider"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
