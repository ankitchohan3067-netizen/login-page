// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("editId");

  // ===============================
  // Prefill only when editing
  // ===============================
  useEffect(() => {
    if (editId) {
      setEmail(searchParams.get("editEmail") || "");
      setPassword("");
    } else {
      // Force clear when normal login
      setEmail("");
      setPassword("");
      setEmailError("");
      setPasswordError("");
      setBackendError("");
    }
  }, [editId, searchParams]);

  // ===============================
  // Email Validation
  // ===============================
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setEmailError("Email cannot be empty");
    } else if (!regex.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // ===============================
  // Strong Password Validation
  // ===============================
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{6,12}$/;

    if (!value) {
      setPasswordError("Password cannot be empty");
    } else if (!passwordRegex.test(value)) {
      setPasswordError(
        "6–12 chars, include uppercase, lowercase, number & special character"
      );
    } else {
      setPasswordError("");
    }
  };

  // ===============================
  // Submit Handler
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");

    if (!email) {
      setEmailError("Email cannot be empty");
      return;
    }

    if (!editId && !password) {
      setPasswordError("Password cannot be empty");
      return;
    }

    if (emailError || passwordError) return;

    try {
      setLoading(true);

      // ===== Edit User =====
      if (editId) {
        const res = await fetch(
          `http://localhost:5000/api/admin/users/${editId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setBackendError(data.message || "Update failed");
          return;
        }

        alert("User updated successfully!");
        navigate("/admin");
      }

      // ===== Login =====
      else {
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

        localStorage.removeItem("token"); // clear old
        localStorage.removeItem("user");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setEmail("");
        setPassword("");

        navigate("/admin");
      }
    } catch {
      setBackendError("Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>{editId ? "Edit User" : "Login"}</h2>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {/* Hidden fake inputs to stop browser autofill */}
        <input type="text" name="fakeuser" style={{ display: "none" }} />
        <input type="password" name="fakepass" style={{ display: "none" }} />

        {/* Email */}
        <input
          type="email"
          name="new-email"
          autoComplete="new-email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          style={{ padding: "8px" }}
        />
        {emailError && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {emailError}
          </span>
        )}

        {/* Password */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="new-password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            style={{ padding: "8px", width: "100%" }}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "5px",
              top: "5px",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {passwordError && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {passwordError}
          </span>
        )}

        {backendError && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {backendError}
          </span>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? editId
              ? "Updating..."
              : "Logging in..."
            : editId
            ? "Update User"
            : "Login"}
        </button>
      </form>
    </div>
  );
}