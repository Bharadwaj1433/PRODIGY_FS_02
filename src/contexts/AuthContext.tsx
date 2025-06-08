
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, Admin } from '../types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedAdmin = localStorage.getItem('admin');
    const token = localStorage.getItem('token');
    
    if (storedAdmin && token) {
      setAdmin(JSON.parse(storedAdmin));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check against registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const adminData: Admin = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      
      setAdmin(adminData);
      setIsAuthenticated(true);
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('token', `token-${user.id}`);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to the Employee Management System!",
      });
      
      return true;
    }
    
    toast({
      title: "Login Failed",
      description: "Invalid email or password. Please check your credentials.",
      variant: "destructive",
    });
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find((u: any) => u.email === email);
    
    if (existingUser) {
      toast({
        title: "Registration Failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      return false;
    }
    
    // Create new user
    const userId = Date.now().toString();
    const newUser = {
      id: userId,
      name,
      email,
      password
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    const adminData: Admin = {
      id: userId,
      name,
      email
    };
    
    setAdmin(adminData);
    setIsAuthenticated(true);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('token', `token-${userId}`);
    
    toast({
      title: "Registration Successful",
      description: "Welcome to the Employee Management System!",
    });
    
    return true;
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (admin) {
      // Update in registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((u: any) => u.id === admin.id);
      
      if (userIndex !== -1) {
        registeredUsers[userIndex] = { ...registeredUsers[userIndex], name, email };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      const updatedAdmin = { ...admin, name, email };
      setAdmin(updatedAdmin);
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{
      admin,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
