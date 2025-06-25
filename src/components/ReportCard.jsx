import React from 'react'
import { MapPin, Calendar, AlertTriangle } from 'lucide-react'

const ReportCard = ({ report, onEdit, onDelete, canEdit = false }) => {
  const getDangerColor = (level) => {
    switch (level) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200'
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'red': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    return status === 'resolved' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDangerColor(report.danger_level)}`}>
            {report.danger_level.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
            {report.status.toUpperCase()}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{report.description}</p>
      
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{report.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{new Date(report.date_reported).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Reported by: {report.user?.username || 'Unknown'}
        </span>
        
        {canEdit && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(report)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(report.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportCard