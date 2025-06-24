import React, { useState, useEffect } from 'react'
import { Plus, Dog } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import SecurityDogForm from '../components/SecurityDogForm'

const SecurityDogPage = () => {
  const [dogs, setDogs] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingDog, setEditingDog] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDogs()
      fetchUsers()
    }
  }, [user])

  const fetchDogs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/security-dogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setDogs(data.dogs || [])
      }
    } catch (error) {
      console.error('Error fetching dogs:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDog = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/security-dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        await fetchDogs()
        setShowForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating dog:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditDog = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/security-dogs/${editingDog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        await fetchDogs()
        setEditingDog(null)
      }
    } catch (error) {
      console.error('Error updating dog:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDog = async (dogId) => {
    if (!window.confirm('Are you sure you want to delete this security dog record?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/security-dogs/${dogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchDogs()
      }
    } catch (error) {
      console.error('Error deleting dog:', error)
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only administrators can manage security dogs.</p>
      </div>
    )
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
        <h1 className="text-3xl font-bold text-gray-900">Security Dogs Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Security Dog</span>
        </button>
      </div>

      {/* Dog Form */}
      {(showForm || editingDog) && (
        <SecurityDogForm
          initialValues={editingDog}
          users={users}
          onSubmit={editingDog ? handleEditDog : handleCreateDog}
          onCancel={() => {
            setShowForm(false)
            setEditingDog(null)
          }}
          isEditing={!!editingDog}
        />
      )}

      {/* Dogs Grid */}
      {dogs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {dogs.map(dog => (
            <div key={dog.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <Dog className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{dog.name}</h3>
                    <p className="text-sm text-gray-600">{dog.company}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  dog.status === 'assigned' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {dog.status.toUpperCase()}
                </span>
              </div>
              
              {dog.assigned_to_user && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Assigned to:</p>
                  <p className="font-medium text-gray-900">{dog.assigned_to_user.username}</p>
                  <p className="text-sm text-gray-600">{dog.assigned_to_user.email}</p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingDog(dog)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDog(dog.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Dog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Security Dogs</h3>
          <p className="text-gray-600 mb-4">No security dogs have been registered yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Add First Security Dog
          </button>
        </div>
      )}
    </div>
  )
}

export default SecurityDogPage