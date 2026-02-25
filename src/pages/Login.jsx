// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // admin edit info from query params
  const editId = searchParams.get("editId");

  useEffect(() => {
    if (editId) {
      setEmail(searchParams.get("editEmail") || "");
      setPassword(""); // admin must enter new password if changing
    } else {
      setEmail("");
      setPassword("");
    }
  }, [editId, searchParams]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // ✅ Runtime validation: show error only if input is non-empty and invalid
    if (!value) {
      setEmailError(""); // empty input → no error
    } else if (e.nativeEvent.inputType !== null) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(value)) setEmailError("Invalid email format");
      else setEmailError("");
    } else {
      // Paste/autofill won't show error
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");

    if (!email || (!editId && !password)) {
      setBackendError("Please fill all fields");
      return;
    }

    if (emailError) return; // runtime validation

    try {
      setLoading(true);

      if (editId) {
        // ✅ Admin updating user
        const res = await fetch(`http://localhost:5000/api/admin/users/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setBackendError(data.message || "Update failed");
          return;
        }
        alert("User updated successfully!");
        navigate("/admin"); // back to admin dashboard
      } else {
        // ✅ Normal login
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setBackendError(data.message || "Invalid credentials");
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        setEmail("");
        setPassword("");
      }
    } catch {
      setBackendError("Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  // ✅ New function to go to admin dashboard
  const goToAdminDashboard = () => {
    navigate("/admin");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>{editId ? "Edit User" : "Login"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }} autoComplete="off">
        <div style={{ position: "relative" }}>
          <input
            type="email"
            name="loginEmail"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            style={{ padding: "8px", width: "100%" }}
            autoComplete="off"
          />
          {emailError && (
            <span style={{ color: "red", fontSize: "12px", position: "absolute", bottom: "-18px", left: 0 }}>
              {emailError}
            </span>
          )}
        </div>

        <input
          type="password"
          name="loginPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", width: "100%" }}
          autoComplete="new-password"
        />

        {backendError && <span style={{ color: "red", fontSize: "12px" }}>{backendError}</span>}

        <button type="submit" disabled={loading} style={{ padding: "10px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? (editId ? "Updating..." : "Logging in...") : editId ? "Update User" : "Login"}
        </button>
      </form>

      {/* ✅ Admin Dashboard button */}
      <button
        onClick={goToAdminDashboard}
        style={{ marginTop: "15px", padding: "10px", width: "100%", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Go to Admin Dashboard
      </button>
    </div>
  );
}