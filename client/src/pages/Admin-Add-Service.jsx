import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const AdminAddService = () => {
    const [data, setData] = useState({
        service : "",
        price : "",
        description : "",
        provider : ""
    });

    const {authorizationToken} = useAuth();
    const navigate = useNavigate();

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...data,
            [name] : value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/admin/services/add", {
                method : "POST",
                headers : {
                    "content-type" : "application/json",
                    Authorization : authorizationToken,
                },
                body : JSON.stringify(data),
            });

            const responseData = await response.json();
            
            if(response.ok){
                toast.success(responseData.message || "Service Added Successfully");
                setData({
                    service : "",
                    price : "",
                    description : "",
                    provider : ""
                });
                navigate("/admin/services");
            }else{
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
                            <label htmlFor="service">service</label>
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
                            <label htmlFor="price">price</label>
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
                            <label htmlFor="description">description</label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                autoComplete="off"
                                value={data.description}
                                onChange={handleInput}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="provider">provider</label>
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
                            <button type="submit">Add Service</button>
                        </div>
                    </form>
                </section>
            </div>
        </section>
    )
    }
