/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Layout } from './components/layout/Layout'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SeedsInventory from './pages/SeedsInventory'
import Fertilizers from './pages/Fertilizers'
import VetChemicals from './pages/VetChemicals'
import Pesticides from './pages/Pesticides'
import Recipients from './pages/Recipients'
import Distribution from './pages/Distribution'
import Reports from './pages/Reports'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  if (!session) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/seeds" element={<ProtectedRoute><SeedsInventory /></ProtectedRoute>} />
          <Route path="/fertilizers" element={<ProtectedRoute><Fertilizers /></ProtectedRoute>} />
          <Route path="/vet-chemicals" element={<ProtectedRoute><VetChemicals /></ProtectedRoute>} />
          <Route path="/pesticides" element={<ProtectedRoute><Pesticides /></ProtectedRoute>} />
          <Route path="/recipients" element={<ProtectedRoute><Recipients /></ProtectedRoute>} />
          <Route path="/distribution" element={<ProtectedRoute><Distribution /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
