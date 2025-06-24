import React, { useState, useEffect } from 'react'
import { Plus, Users, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PatrolsPage = () => {
  const [patrols, setPatrols] = useState([])
  const [userPatrols, setUserPatrols] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPatrols()
    fetchUserPatrols()
  }, [])

  const fetchPatrols = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/patrols', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setPatrols(data.patrols || [])
      }
    } catch (error) {
      console.error('Error fetching patrols:', error)
    }
  }

  const fetchUserPatrols = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user-patrols', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setUserPatrols(data.user_patrols || [])
      }
    } catch (error) {
      console.error('Error fetching user patrols:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinPatrol = async (patrolId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user-patrols', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patrol_id: patrolId,
          role_in_patrol: 'member'
        })
      })

      if (response.ok) {
        await fetchUserPatrols()
      }
    } catch (error) {
      console.error('Error joining patrol:', error)
    }
  }

  const handleLeavePatrol = async (patrolId) => {
    if (!window.confirm('Are you sure you want to leave this patrol?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const userPatrol = userPatrols.find(up => up.patrol_id === patrolId)
      
      if (userPatrol) {
        const response = await fetch(`/api/user-patrols/${userPatrol.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          await fetchUserPatrols()
        }
      }
    } catch (error) {
      console.error('Error leaving patrol:', error)
    }
  }

  const isUserInPatrol = (patrolId) => {
    return userPatrols.some(up => up.patrol_id === patrolId)
  }

  const getUserRole = (patrolId) => {
    const userPatrol = userPatrols.find(up => up.patrol_id === patrolId)
    return userPatrol?.role_in_patrol || null
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Community Patrols</h1>
      </div>

      {/* My Patrols */}
      {userPatrols.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Patrols</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {userPatrols.map(userPatrol => {
              const patrol = patrols.find(p => p.id === userPatrol.patrol_id)
              if (!patrol) return null
              
              return (
                <div key={userPatrol.id} className="card border-blue-200 bg-blue-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{patrol.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userPatrol.role_in_patrol === 'leader' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userPatrol.role_in_patrol.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{patrol.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(patrol.scheduled_time).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{patrol.location}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleLeavePatrol(patrol.id)}
                    className="btn-danger text-sm"
                  >
                    Leave Patrol
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Available Patrols */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Patrols</h2>
        {patrols.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {patrols.map(patrol => (
              <div key={patrol.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{patrol.name}</h3>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{patrol.member_count || 0} members</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{patrol.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(patrol.scheduled_time).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{patrol.location}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  {isUserInPatrol(patrol.id) ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-medium">✓ Joined</span>
                      <span className="text-sm text-gray-500">
                        as {getUserRole(patrol.id)}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoinPatrol(patrol.id)}
                      className="btn-primary"
                    >
                      Join Patrol
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Patrols Available</h3>
            <p className="text-gray-600">Check back later for new patrol opportunities.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatrolsPage