import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminServices = () => {
  const [services, setServices] = useState([]);
  const { authorizationToken } = useAuth();

  const getAllServicesData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/services", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setServices(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteService = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/services/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.ok) {
        toast.success("Service deleted successfully");
        getAllServicesData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllServicesData();
  }, []);

  return (
    <>
      <section className="admin-services-section">
         <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Admin Services Data</h1>
          <Link to="/admin/services/add" className="btn" style={{ padding: "10px 20px", backgroundColor: "var(--btn-color)", color: "#fff", borderRadius: "8px", textDecoration: "none" }}>Add Service</Link>
        </div>
        <div className="container admin-services">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Price</th>
                <th>Provider</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {services.map((curService, index) => {
                return (
                  <tr key={index}>
                    <td>{curService.service}</td>
                    <td>{curService.price}</td>
                    <td>{curService.provider}</td>
                    <td>
                      <Link to={`/admin/services/${curService._id}/edit`}>Edit</Link>
                    </td>
                    <td>
                      <button onClick={() => deleteService(curService._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
