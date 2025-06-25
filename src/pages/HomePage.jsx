import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Users, Shield, TrendingUp } from 'lucide-react'
import ReportCard from '../components/ReportCard'

const HomePage = () => {
  const [recentReports, setRecentReports] = useState([])
  const [stats, setStats] = useState({
    totalReports: 0,
    activePatrols: 0,
    communityMembers: 0,
    resolvedReports: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`
      }

      // Fetch recent reports
      const reportsResponse = await fetch('/api/reports?limit=3', { headers })
      const reportsData = await reportsResponse.json()
      
      // Fetch stats
      const statsResponse = await fetch('/api/stats', { headers })
      const statsData = await statsResponse.json()

      if (reportsResponse.ok) {
        setRecentReports(reportsData.reports || [])
      }
      
      if (statsResponse.ok) {
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white p-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">Welcome to Neighborhood Watch</h1>
          <p className="text-blue-100 text-lg mb-6">
            Keep your community safe by reporting incidents, joining patrols, and staying informed about local safety concerns.
          </p>
          <div className="flex space-x-4">
            <Link to="/reports" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              View Reports
            </Link>
            <Link to="/patrols" className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Join Patrol
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalReports}</div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>
        <div className="card text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.activePatrols}</div>
          <div className="text-sm text-gray-600">Active Patrols</div>
        </div>
        <div className="card text-center">
          <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.communityMembers}</div>
          <div className="text-sm text-gray-600">Community Members</div>
        </div>
        <div className="card text-center">
          <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.resolvedReports}</div>
          <div className="text-sm text-gray-600">Resolved Reports</div>
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
          <Link to="/reports" className="text-blue-600 hover:text-blue-800 font-medium">
            View All Reports →
          </Link>
        </div>
        
        {recentReports.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Reports</h3>
            <p className="text-gray-600 mb-4">Your neighborhood is quiet right now.</p>
            <Link to="/reports" className="btn-primary">
              Create First Report
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage