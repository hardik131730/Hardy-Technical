import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../store/auth";

const URL = "http://localhost:5000/api/auth/login";

export const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const {storeTokenInLS} = useAuth();

    // handling the input values
    const handleInput = (e) => {
        console.log(e);
        let name = e.target.name;
        let value = e.target.value;

        setUser({
            ...user,
            [name]: value,
        });
    };

    // handling form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            console.log("login form",response);

            if(response.ok){
                alert("Login successful");
                const res_data =  await response.json();
                storeTokenInLS(res_data.token);

                setUser({email: "",password: ""});
                navigate('/');
            }else{
                alert("Invalid credentials");
                console.log("Invalid credentials");
            }

        } catch (error) {
            console.log(error);
        }
    };
    return (
    <>
        <section>
            <main>
                <div className="section-login">
                    <div className="container grid-two-cols">
                        <div className="login-image">
                            <img 
                                src="/images/login.png" 
                                alt="a boy is trying to do login"
                                width="500"
                                height="500"
                            />
                        </div>

                        {/* let tackle login form */}
                        <div className="login-form">
                            <h1 className="main-heading mb-3">Login form</h1>
                            <br />

                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email">email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="email" 
                                        id="email" 
                                        autoComplete="off" 
                                        value={user.email}
                                        onChange={handleInput}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password">password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="password" 
                                        id="password" 
                                        autoComplete="off"
                                        value={user.password}
                                        onChange={handleInput}
                                    />
                                </div>
                                <br />

                                <button type="submit" className="btn btn-submit">login Now</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    </>)
};