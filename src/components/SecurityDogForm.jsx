import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const DogSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  company: Yup.string().required('Company is required'),
  assigned_to: Yup.number().nullable(),
  status: Yup.string()
    .oneOf(['available', 'assigned'], 'Please select a valid status')
    .required('Status is required')
})

const SecurityDogForm = ({ initialValues, users, onSubmit, onCancel, isEditing = false }) => {
  const defaultValues = {
    name: '',
    company: '',
    assigned_to: null,
    status: 'available',
    ...initialValues
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Security Dog' : 'Add New Security Dog'}
      </h3>
      
      <Formik
        initialValues={defaultValues}
        validationSchema={DogSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="form-label">Dog Name</label>
              <Field
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter dog's name"
              />
              <ErrorMessage name="name" component="div" className="form-error" />
            </div>

            <div>
              <label className="form-label">Security Company</label>
              <Field
                name="company"
                type="text"
                className="form-input"
                placeholder="Enter security company name"
              />
              <ErrorMessage name="company" component="div" className="form-error" />
            </div>

            <div>
              <label className="form-label">Status</label>
              <Field 
                name="status" 
                as="select" 
                className="form-input"
                onChange={(e) => {
                  setFieldValue('status', e.target.value)
                  if (e.target.value === 'available') {
                    setFieldValue('assigned_to', null)
                  }
                }}
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
              </Field>
              <ErrorMessage name="status" component="div" className="form-error" />
            </div>

            {values.status === 'assigned' && (
              <div>
                <label className="form-label">Assign to User</label>
                <Field name="assigned_to" as="select" className="form-input">
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="assigned_to" component="div" className="form-error" />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Dog' : 'Add Dog')}
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

export default SecurityDogForm