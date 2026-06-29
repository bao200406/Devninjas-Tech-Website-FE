"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logoutUser } from "../services/authService"; // Import thêm logoutUser

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Bổ sung hàm logout
  const logout = async () => {
    try {
      await logoutUser(); // Gọi API logout
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Dù thành công hay thất bại, đều reset user về null
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);