"use client"
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutSuperAdmin } from '@/redux/superAdminRedux/superAdminSlice'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, Building, Badge } from "lucide-react"
import { Button } from "@/components/ui/button"

const SuperAdminProfile = () => {
  // const dispatch = useDispatch()
  const { user } = useSelector((state) => state.superAdmin)

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="flex justify-center items-center h-32 text-gray-500">
            No Super Admin data found. Please log in again.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6" />
            Super Admin Profile
          </CardTitle>
          {/* <Button
            variant="destructive"
            size="sm"
            onClick={() => dispatch(logoutSuperAdmin())}
          >
            Logout
          </Button> */}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name || 'Super Admin'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  <Badge className="h-3 w-3" />
                  {user?.role || 'superadmin'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium">{user?.email || 'N/A'}</p>
              </div>
            </div>

            {user?.restaurantName && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-600">Restaurant Name</p>
                  <p className="font-medium text-blue-900">{user.restaurantName}</p>
                </div>
              </div>
            )}

            {user?.createdAt && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
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
