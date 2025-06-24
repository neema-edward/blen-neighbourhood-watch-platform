import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReportsPage from './pages/ReportsPage'
import PatrolsPage from './pages/PatrolsPage'
import UserProfilePage from './pages/UserProfilePage'
import CommunityPage from './pages/CommunityPage'
import SecurityDogPage from './pages/SecurityDogPage'
import AuthForms from './components/AuthForms'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForms />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/patrols" element={<PatrolsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          {user.role === 'admin' && (
            <Route path="/dogs" element={<SecurityDogPage />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App