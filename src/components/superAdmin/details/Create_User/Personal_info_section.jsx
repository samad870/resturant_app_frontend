import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export function PersonalInfoSection({ form }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Enter full name" {...field} className="pl-10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input type="email" placeholder="Enter email address" {...field} className="pl-10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={form.control} name="password" render={({ field }) => (
        <FormItem>
          <FormLabel>Password *</FormLabel>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                {...field} 
                className="pl-10 pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormControl>
          <FormDescription>Password must be at least 5 characters long</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  )
}