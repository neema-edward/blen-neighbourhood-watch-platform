import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const ReportSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  location: Yup.string()
    .matches(/^[\w\s,.-]+$/, 'Please enter a valid address')
    .required('Location is required'),
  danger_level: Yup.string()
    .oneOf(['green', 'orange', 'red'], 'Please select a danger level')
    .required('Danger level is required')
})

const ReportForm = ({ initialValues, onSubmit, onCancel, isEditing = false }) => {
  const defaultValues = {
    title: '',
    description: '',
    location: '',
    danger_level: 'green',
    ...initialValues
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Report' : 'Create New Report'}
      </h3>
      
      <Formik
        initialValues={defaultValues}
        validationSchema={ReportSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="form-label">Title</label>
              <Field
                name="title"
                type="text"
                className="form-input"
                placeholder="Brief title for the incident"
              />
              <ErrorMessage name="title" component="div" className="form-error" />
            </div>

            <div>
              <label className="form-label">Description</label>
              <Field
                name="description"
                as="textarea"
                rows="4"
                className="form-input"
                placeholder="Detailed description of the incident (minimum 10 characters)"
              />
              <ErrorMessage name="description" component="div" className="form-error" />
            </div>

            <div>
              <label className="form-label">Location</label>
              <Field
                name="location"
                type="text"
                className="form-input"
                placeholder="Street address or area description"
              />
              <ErrorMessage name="location" component="div" className="form-error" />
            </div>

            <div>
              <label className="form-label">Danger Level</label>
              <Field name="danger_level" as="select" className="form-input">
                <option value="green">Green - Low Risk</option>
                <option value="orange">Orange - Medium Risk</option>
                <option value="red">Red - High Risk</option>
              </Field>
              <ErrorMessage name="danger_level" component="div" className="form-error" />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Report' : 'Create Report')}
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

export default ReportForm