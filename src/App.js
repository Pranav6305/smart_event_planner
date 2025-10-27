// src/App.js (FIXED)
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Auth Context components
import { AuthContextProvider, UserAuth } from "./context/AuthContext"; 

// Import all custom components and pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddEvent from "./pages/AddEvent";
import EventDetail from "./pages/EventDetail";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Component to handle the loading state and content
const AppContent = () => {
    // Get the auth state and loading flag from context
    const { loading } = UserAuth();

    // 1. Loading State: Display a global spinner while Firebase checks session
    if (loading) {
        return (
            // Centered, full-screen loading message
            <div className='flex items-center justify-center min-h-screen pt-20'> 
                <p className='text-3xl font-bold text-indigo-600'>Loading Planner... ⏳</p>
            </div>
        );
    }
    
    // 2. Ready State: Render the Navbar and Routes once auth status is known
    return (
        <>
            <Navbar />
            {/* The p-4 class will apply spacing *below* the fixed Navbar */}
            <div className="p-4">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes (Require Login) */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard /> {/* Dashboard is now PROTECTED */}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/addevent"
                        element={
                            <ProtectedRoute>
                                <AddEvent />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/event/:id"
                        element={
                            <ProtectedRoute>
                                <EventDetail />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </>
    );
};

function App() {
    return (
        <BrowserRouter>
            {/* CRITICAL FIX: Wrap the entire application logic inside AuthContextProvider */}
            <AuthContextProvider>
                <AppContent />
            </AuthContextProvider>
        </BrowserRouter>
    );
}

export default App;