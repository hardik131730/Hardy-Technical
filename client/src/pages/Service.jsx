import {useAuth} from "../store/auth";

export const Service = () => {

    const { services } = useAuth();
    console.log(services);

    return (
        <section className="section-services">
            <div className="container">
                <h1 className="main-heading">Services </h1>
            </div>

            <div className="container grid grid-three-cols">

                {services.map((curElem,index) => {
                    const {service, description, price, provider} = curElem;

                    return(
                    <div className="card" key ={index}>
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
                                <p>{price}</p>
                            </div>
                            <h2>{service}</h2>
                            <p>{description}</p>
                        </div>
                    </div>)
                    })
                }
                
            </div>
        </section>
    )
};