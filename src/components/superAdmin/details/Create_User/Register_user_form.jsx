"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { NotificationModal } from "../../common/notificationModal"
import config from "@/config"
import { PersonalInfoSection } from "./Personal_info_section"
import { RestaurantInfoSection } from "./Restaurant-info-section"
import { RoleSection } from "./Role_section"

// Updated schema with all roles
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  role: z.enum(["admin", "staff", "superadmin", "user"], {
    required_error: "Please select a role",
  }),
  domain: z.string().min(3, "Domain must be at least 3 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Domain can only contain letters, numbers, and hyphens")
    .optional(),
  restaurantName: z.string().min(2, "Restaurant name must be at least 2 characters").optional()
}).refine((data) => {
  if (data.role === "admin") {
    return data.domain && data.domain.length >= 3 && data.restaurantName && data.restaurantName.length >= 2
  }
  return true
}, {
  message: "Domain and restaurant name are required for admin role",
  path: ["domain"]
})

export function RegisterUserForm() {
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      domain: "",
      restaurantName: ""
    }
  })

  const selectedRole = form.watch("role")

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
  }

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" })
  }

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await fetch(`${config.BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle duplicate domain error
        if (data.message && data.message.includes('domain')) {
          form.setError('domain', {
            type: 'manual',
            message: 'Domain already exists. Please choose a different one.'
          })
          throw new Error(data.message)
        }
        throw new Error(data.message || 'Registration failed')
      }

      // Show appropriate success message based on role
      let successMessage = "";
      switch (values.role) {
        case "admin":
          successMessage = `Admin ${data.user.name} has been created with restaurant ${data.restaurant?.restaurantName}`;
          break;
        case "staff":
          successMessage = `Staff ${data.user.name} has been registered successfully`;
          break;
        case "superadmin":
          successMessage = `Superadmin ${data.user.name} has been created successfully`;
          break;
        case "user":
          successMessage = `User ${data.user.name} has been created successfully`;
          break;
        default:
          successMessage = `User ${data.user.name} has been created successfully`;
      }

      showNotification(successMessage, "success")
      form.reset()
    } catch (error) {
      showNotification(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NotificationModal notification={notification} onClose={closeNotification} />
      
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Register New User</h2>
          <p className="text-gray-600 mt-2">Create a new user account with role selection</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <PersonalInfoSection form={form} />
            <RoleSection form={form} />
            
            {/* Show restaurant fields only when admin role is selected */}
            {selectedRole === "admin" && (
              <RestaurantInfoSection form={form} />
            )}

            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="w-auto min-w-[200px]" 
                disabled={loading} 
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating {selectedRole || "User"}...
                  </>
                ) : (
                  `Register ${selectedRole || "User"}`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}