import React, { useState, useEffect } from 'react'
import { Plus, Filter } from 'lucide-react'
import ReportCard from '../components/ReportCard'
import ReportForm from '../components/ReportForm'
import { useAuth } from '../context/AuthContext'

const ReportsPage = () => {
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingReport, setEditingReport] = useState(null)
  const [filters, setFilters] = useState({
    danger_level: 'all',
    status: 'all'
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reports, filters])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = reports

    if (filters.danger_level !== 'all') {
      filtered = filtered.filter(report => report.danger_level === filters.danger_level)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status)
    }

    setFilteredReports(filtered)
  }

  const handleCreateReport = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        await fetchReports()
        setShowForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating report:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditReport = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reports/${editingReport.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        await fetchReports()
        setEditingReport(null)
      }
    } catch (error) {
      console.error('Error updating report:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchReports()
      }
    } catch (error) {
      console.error('Error deleting report:', error)
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Incident Reports</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danger Level</label>
              <select
                value={filters.danger_level}
                onChange={(e) => setFilters({...filters, danger_level: e.target.value})}
                className="form-input w-32"
              >
                <option value="all">All Levels</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="form-input w-32"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Form */}
      {(showForm || editingReport) && (
        <ReportForm
          initialValues={editingReport}
          onSubmit={editingReport ? handleEditReport : handleCreateReport}
          onCancel={() => {
            setShowForm(false)
            setEditingReport(null)
          }}
          isEditing={!!editingReport}
        />
      )}

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              canEdit={user?.id === report.user_id || user?.role === 'admin'}
              onEdit={setEditingReport}
              onDelete={handleDeleteReport}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600 mb-4">
            {reports.length === 0 
              ? "No reports have been created yet." 
              : "No reports match your current filters."
            }
          </p>
          {reports.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create First Report
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ReportsPage