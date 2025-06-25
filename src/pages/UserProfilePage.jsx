import React, { useState, useEffect } from 'react'
import { User, MapPin, Calendar, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const UserProfilePage = () => {
  const [userReports, setUserReports] = useState([])
  const [userPatrols, setUserPatrols] = useState([])
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedReports: 0,
    activePatrols: 0
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`
      }

      // Fetch user reports
      const reportsResponse = await fetch('/api/user/reports', { headers })
      const reportsData = await reportsResponse.json()
      
      // Fetch user patrols
      const patrolsResponse = await fetch('/api/user-patrols', { headers })
      const patrolsData = await patrolsResponse.json()

      if (reportsResponse.ok) {
        setUserReports(reportsData.reports || [])
        setStats(prev => ({
          ...prev,
          totalReports: reportsData.reports?.length || 0,
          resolvedReports: reportsData.reports?.filter(r => r.status === 'resolved').length || 0
        }))
      }
      
      if (patrolsResponse.ok) {
        setUserPatrols(patrolsData.user_patrols || [])
        setStats(prev => ({
          ...prev,
          activePatrols: patrolsData.user_patrols?.length || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDangerColor = (level) => {
    switch (level) {
      case 'green': return 'text-green-600'
      case 'orange': return 'text-orange-600'
      case 'red': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
          <p className="text-gray-600">{user?.email}</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user?.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {user?.role === 'admin' ? 'Administrator' : 'Resident'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalReports}</div>
          <div className="text-sm text-gray-600">Reports Created</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.resolvedReports}</div>
          <div className="text-sm text-gray-600">Reports Resolved</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.activePatrols}</div>
          <div className="text-sm text-gray-600">Active Patrols</div>
        </div>
      </div>

      {/* My Reports */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Reports</h2>
        {userReports.length > 0 ? (
          <div className="space-y-4">
            {userReports.map(report => (
              <div key={report.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <div className="flex space-x-2">
                    <span className={`text-sm font-medium ${getDangerColor(report.danger_level)}`}>
                      {report.danger_level.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{report.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(report.date_reported).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-600">You haven't created any reports yet.</p>
          </div>
        )}
      </div>

      {/* My Patrols */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Patrols</h2>
        {userPatrols.length > 0 ? (
          <div className="space-y-4">
            {userPatrols.map(userPatrol => (
              <div key={userPatrol.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{userPatrol.patrol?.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userPatrol.role_in_patrol === 'leader' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {userPatrol.role_in_patrol.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{userPatrol.patrol?.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(userPatrol.patrol?.scheduled_time).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{userPatrol.patrol?.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-600">You haven't joined any patrols yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfilePage