import React, { useState, useEffect } from 'react'
import { Plus, AlertTriangle, MessageSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CommunityPostForm from '../components/CommunityPostForm'

const CommunityPage = () => {
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/community-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/community-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        await fetchPosts()
        setShowForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/community-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
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
        <h1 className="text-3xl font-bold text-gray-900">Community Updates</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Post</span>
          </button>
        )}
      </div>

      {/* Post Form */}
      {showForm && (
        <CommunityPostForm
          onSubmit={handleCreatePost}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className={`card ${post.is_alert ? 'border-red-200 bg-red-50' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {post.is_alert && (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  {post.is_alert && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      ALERT
                    </span>
                  )}
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Posted by {post.created_by_user?.username || 'Admin'}</span>
                </div>
                <span>{new Date(post.date_posted).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Community Posts</h3>
          <p className="text-gray-600 mb-4">No announcements or updates have been posted yet.</p>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create First Post
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CommunityPage