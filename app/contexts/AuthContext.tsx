import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for User and AuthContext
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

// Define the props for the AuthProvider component
interface AuthProviderProps {
    children: ReactNode;
}

// Create the AuthContext with the correct default valu
const AuthContext = createContext<AuthContextType | undefined>(undefined)
// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    // Login function
    const login = (user: User) => {
        setUser(user);
        // Additional login logic, e.g., setting tokens, can go here
    };

    // Logout function
    const logout = () => {
        setUser(null);
        // Additional logout logic, e.g., clearing tokens, can go here
    };

    // Context value
    const value: AuthContextType = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for accessing the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    // Ensuring the context is not undefined
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};