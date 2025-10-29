"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, Building, Badge, Loader2 } from "lucide-react"

const SuperAdminProfile = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setUserData(user)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading profile...
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6" />
            Super Admin Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {userData?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{userData?.name || 'Super Admin'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  <Badge className="h-3 w-3" />
                  {userData?.role || 'superadmin'}
                </span>
              </div>
            </div>
          </div>

          {/* User Details - Only show non-null values */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium">{userData?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Badge className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium capitalize">{userData?.role || 'superadmin'}</p>
              </div>
            </div>

            {/* Restaurant Name - Only show if not null */}
            {userData?.restaurantName && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-600">Restaurant Name</p>
                  <p className="font-medium text-blue-900">{userData.restaurantName}</p>
                </div>
              </div>
            )}

            {/* Created Date - Only show if not null */}
            {userData?.createdAt && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SuperAdminProfile