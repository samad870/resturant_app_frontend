import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Building, Globe } from "lucide-react"

export function RestaurantInfoSection({ form }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Restaurant Information</h3>
      
      <FormField control={form.control} name="restaurantName" render={({ field }) => (
        <FormItem>
          <FormLabel>Restaurant Name *</FormLabel>
          <FormControl>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Enter restaurant name" {...field} className="pl-10" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="domain" render={({ field }) => (
        <FormItem>
          <FormLabel>Domain *</FormLabel>
          <FormControl>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Enter domain name" {...field} className="pl-10" />
            </div>
          </FormControl>
          <FormDescription>
            This will be used to generate QR code: https://{form.watch('domain') || 'your-domain'}.yourdomain.com
          </FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  )
}