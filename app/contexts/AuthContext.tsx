import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the types for User and AuthContext
interface User {
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => Promise<void>;
  register: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Load the user from Async Storage when the app starts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (user: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user)); // Save the user to storage
      setUser(user);
    } catch (error) {
      console.error("Failed to save user to storage:", error);
    }
  };

  // Register function (same logic as login for simplicity)
  const register = async (user: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user)); // Save the user to storage
      setUser(user);
    } catch (error) {
      console.error("Failed to save user to storage:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user"); // Remove the user from storage
      setUser(null);
    } catch (error) {
      console.error("Failed to remove user from storage:", error);
    }
  };

  // Context value
  const value: AuthContextType = { user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for accessing the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // Ensuring the context is not undefined
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
