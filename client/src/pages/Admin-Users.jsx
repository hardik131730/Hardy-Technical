import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const { authorizationToken } = useAuth();

  const getAllUsersData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users?page=${currentPage}&limit=${limit}&search=${search}`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.ok) {
        toast.success("User deleted successfully");
        getAllUsersData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAllUsersData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentPage, limit, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <>
      <section className="admin-users-section">
        <div className="container admin-users-header">
          <div className="header-title-container">
            <h1>Admin Users Data</h1>
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
                placeholder="Search users..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <Link to="/admin/users/add" className="btn" style={{ padding: "10px 20px", backgroundColor: "var(--btn-color)", color: "#fff", borderRadius: "8px", textDecoration: "none" }}>Add User</Link>
          </div>
        </div>
        <div className="container admin-users">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((curUser, index) => {
                  return (
                    <tr key={index}>
                      <td>{curUser.username}</td>
                      <td>{curUser.email}</td>
                      <td>{curUser.phone}</td>
                      <td>
                        <Link to={`/admin/users/${curUser._id}/edit`}>Edit</Link>
                      </td>
                      <td>
                        <button onClick={() => deleteUser(curUser._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                   <td colSpan="5" style={{ textAlign: "center" }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
          
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
