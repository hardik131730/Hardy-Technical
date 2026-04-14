import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const { authorizationToken } = useAuth();

  const getAllServicesData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/services?page=${currentPage}&limit=${limit}&search=${search}`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setServices(data.services);
        setTotalPages(data.totalPages);
      } else {
        setServices([]);
        setTotalPages(1);
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
    const timeoutId = setTimeout(() => {
      getAllServicesData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentPage, limit, search]);

  return (
    <>
      <section className="admin-services-section">
        <div className="container admin-services-header">
          <div className="header-title-container">
            <h1>Admin Services Data</h1>
            <div className="limit-selector">
              <label>Show </label>
              <select value={limit} onChange={(e) => { setLimit(parseInt(e.target.value)); setCurrentPage(1); }}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
              <label> entries</label>
            </div>
          </div>
          <div className="header-right-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <Link to="/admin/services/add" className="btn" style={{ padding: "10px 20px", backgroundColor: "var(--btn-color)", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "1.6rem" }}>Add Service</Link>
          </div>
        </div>
        <div className="container admin-services">
          <div className="admin-table-container">
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
                {services && services.length > 0 ? (
                  services.map((curService, index) => {
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
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>No services found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
