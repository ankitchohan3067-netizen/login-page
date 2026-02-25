// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/admin";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleEdit = (user) => {
    // Redirect to login page with query params for editing
    window.location.href = `/login?editId=${user.id}&editEmail=${encodeURIComponent(user.email)}&editPassword=${encodeURIComponent(user.password)}`;
  };

  // ✅ Button to go to login page
  const goToLoginPage = () => {
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Admin Dashboard</h2>
      {loading && <p>Loading...</p>}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.password}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Login page button */}
      <button
        onClick={goToLoginPage}
        style={{
          marginTop: "15px",
          padding: "10px",
          width: "100%",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Go to Login Page
      </button>
    </div>
  );
}