import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const PostSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string()
    .min(10, 'Content must be at least 10 characters')
    .required('Content is required'),
  is_alert: Yup.boolean()
})

const CommunityPostForm = ({ onSubmit, onCancel }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Create Community Post</h3>
      
      <Formik
        initialValues={{
          title: '',
          content: '',
          is_alert: false
        }}
        validationSchema={PostSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="form-label">Title</label>
              <Field
                name="title"
                type="text"
                className="form-input"
                placeholder="Post title"
              />
              <ErrorMessage name="title" component="div" className="form-error" />
            </div>

            <div>
              <label className="form-label">Content</label>
              <Field
                name="content"
                as="textarea"
                rows="6"
                className="form-input"
                placeholder="Write your community update or announcement..."
              />
              <ErrorMessage name="content" component="div" className="form-error" />
            </div>

            <div className="flex items-center space-x-2">
              <Field
                name="is_alert"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Mark as Alert (will notify all community members)
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CommunityPostForm