import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const AdminContacts = () => {
    const [contactData, setContactData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(5); 
    const [search, setSearch] = useState("");
    const { authorizationToken } = useAuth();

    const getContactsData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/contacts?page=${currentPage}&limit=${limit}&search=${search}`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setContactData(data.contacts);
                setTotalPages(data.totalPages);
            } else {
                setContactData([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteContact = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/contacts/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            if (response.ok) {
                toast.success("Contact deleted successfully");
                getContactsData();
            } else {
                toast.error("Not Deleted");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getContactsData();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [currentPage, limit, search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <section className="admin-contacts-section">
            <div className="container admin-contacts-header">
                <div className="header-title-container">
                    <h1>Admin Contact Data</h1>
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
                            placeholder="Search contacts..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>
            <div className="container admin-contacts">
                <table>
                    <thead>
                        <tr>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contactData && contactData.length > 0 ? (
                            contactData.map((curData, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {curData.image ? (
                                                <img 
                                                    src={`http://localhost:5000${curData.image}`} 
                                                    alt={curData.username} 
                                                    className="admin-user-img" 
                                                />
                                            ) : (
                                                <div className="admin-user-img-placeholder">
                                                    {curData.username[0].toUpperCase()}
                                                </div>
                                            )}
                                        </td>
                                        <td>{curData.username}</td>
                                        <td>{curData.email}</td>
                                        <td>{curData.message}</td>
                                        <td>
                                            <button onClick={() => deleteContact(curData._id)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>No contacts found</td>
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
    );
};
