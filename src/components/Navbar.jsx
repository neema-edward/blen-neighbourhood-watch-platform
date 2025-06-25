import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Neighborhood Watch</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/reports"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/reports') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Reports
            </Link>
            <Link
              to="/patrols"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/patrols') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Patrols
            </Link>
            <Link
              to="/community"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/community') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Community
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/dogs"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dogs') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Security Dogs
              </Link>
            )}
            
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{user?.username}</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar