import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Crown, Users, Shield, UserCheck } from "lucide-react"

export function RoleSection({ form }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Account Type</h3>
      
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="pl-10">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    <span>Admin (with Restaurant)</span>
                  </div>
                </SelectItem>
                <SelectItem value="staff">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    <span>Staff</span>
                  </div>
                </SelectItem>
                <SelectItem value="superadmin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Superadmin</span>
                  </div>
                </SelectItem>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>User</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              {form.watch("role") === "admin" && "Admin can create and manage restaurants"}
              {form.watch("role") === "staff" && "Staff members work under an admin's restaurant"}
              {form.watch("role") === "superadmin" && "Superadmin has full system access"}
              {form.watch("role") === "user" && "Regular user account"}
              {!form.watch("role") && "Select a role to see description"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}