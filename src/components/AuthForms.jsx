import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
})

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
})

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  const handleLogin = async (values, { setSubmitting }) => {
    setError('')
    const result = await login(values.username, values.password)
    
    if (!result.success) {
      setError(result.error)
    }
    setSubmitting(false)
  }

  const handleRegister = async (values, { setSubmitting }) => {
    setError('')
    const result = await register(values.username, values.email, values.password)
    
    if (!result.success) {
      setError(result.error)
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Neighborhood Watch
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {isLogin ? (
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="form-label">Username</label>
                    <Field
                      name="username"
                      type="text"
                      className="form-input"
                      placeholder="Enter your username"
                    />
                    <ErrorMessage name="username" component="div" className="form-error" />
                  </div>

                  <div>
                    <label className="form-label">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="form-input"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="form-error" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="form-label">Username</label>
                    <Field
                      name="username"
                      type="text"
                      className="form-input"
                      placeholder="Choose a username"
                    />
                    <ErrorMessage name="username" component="div" className="form-error" />
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="form-error" />
                  </div>

                  <div>
                    <label className="form-label">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="form-input"
                      placeholder="Create a password"
                    />
                    <ErrorMessage name="password" component="div" className="form-error" />
                  </div>

                  <div>
                    <label className="form-label">Confirm Password</label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className="form-input"
                      placeholder="Confirm your password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForms