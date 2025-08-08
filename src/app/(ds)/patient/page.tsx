"use client"
import React from 'react'
import { useAuth } from '@/lib/api/auth'


export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {user, logout } = useAuth()
  if (!user) return null
  return (
    <div>
      <h1 className="text-2xl font-bold">Patient Dashboard</h1>
      <p>Welcome, {user.profile.firstName} {user.profile.lastName}!</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button></div>
  )
}
