import { RegisterUserForm } from "@/components/superAdmin/details/Create_User/Register_user_form"

export default function CreateUserPage() {
  return (
    <div className="min-h-screen  ">
      <div className="max-w-4xl mx-auto px-4">
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">User Registration</h1>
          <p className="text-gray-600 mt-2">Create new user accounts with restaurant details</p>
        </div> */}
        <RegisterUserForm />
      </div>
    </div>
  )
}