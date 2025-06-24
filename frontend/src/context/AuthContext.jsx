import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      await fetchUser(data.token);
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const register = async (name, email, password, code) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, code }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const fetchUser = async (jwt = token) => {
    if (!jwt) return;

    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setUser({ ...data, token: jwt });
    } else {
      logout();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    if (!user || !user.token) return;

    const decoded = JSON.parse(atob(user.token.split(".")[1])); // decode JWT
    const exp = decoded.exp * 1000; // convert to ms

    const now = Date.now();
    const timeUntilExpiry = exp - now;

    if (timeUntilExpiry <= 0) {
      logout(); // Token already expired
    } else {
      const timeout = setTimeout(() => {
        logout(); // Auto logout when token expires
      }, timeUntilExpiry);

      return () => clearTimeout(timeout); // Clear on unmount or user change
    }
  }, [user, logout]);

  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
