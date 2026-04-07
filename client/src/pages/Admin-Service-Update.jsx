import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const AdminServiceUpdate = () => {
    const [data, setData] = useState({
        service: "",
        description: "",
        price: "",
        provider: "",
    });

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

        setData({
            ...data,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/admin/services/update/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify(data),
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
                            <button type="submit">Update Service</button>
                        </div>
                    </form>
                </section>
            </div>
        </section>
    );
};
