"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Loader2,
  User,
  Mail,
  Clock,
} from "lucide-react";
import UpdateAdminModal from "./UpdateAdminModal";
import {
  useGetAdminsQuery,
  useUpdateAdminMutation,
} from "@/redux/superAdminRedux/superAdminAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  openUpdateModal,
  closeUpdateModal,
} from "@/redux/superAdminRedux/superAdminSlice";

export default function AdminsList() {
  const dispatch = useDispatch();
  const { isUpdateModalOpen, selectedAdmin } = useSelector(
    (state) => state.superAdmin
  );

  const { data, isLoading, refetch } = useGetAdminsQuery();
  const [updateAdmin] = useUpdateAdminMutation();

  const admins = data?.admins || [];

  const handleUpdate = async (adminId, updateData) => {
    try {
      await updateAdmin({ adminId, updateData }).unwrap();
      refetch();
      dispatch(closeUpdateModal());
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  const getRemainingDays = (createdAt) => {
    const createdDate = new Date(createdAt);
    const oneYearLater = new Date(createdDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const diffDays = Math.ceil(
      (oneYearLater - new Date()) / (1000 * 60 * 60 * 24)
    );
    return diffDays > 0 ? diffDays : 0;
  };

  const getSubscriptionBadge = (days) => {
    if (days > 30)
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    if (days > 7)
      return <Badge className="bg-yellow-100 text-yellow-800">Expiring</Badge>;
    if (days > 0)
      return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
    return <Badge className="bg-red-400 text-gray-800">Expired</Badge>;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <>
      <UpdateAdminModal
        open={isUpdateModalOpen}
        admin={selectedAdmin}
        onClose={() => dispatch(closeUpdateModal())}
        onUpdate={handleUpdate}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Admins List
          </CardTitle>
          <CardDescription>Total {admins.length} admins found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => {
                  const remainingDays = getRemainingDays(admin.createdAt);
                  return (
                    <TableRow key={admin._id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" /> {admin.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{admin.domain}</Badge>
                      </TableCell>
                      <TableCell>{admin.restaurantName || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {remainingDays} days {getSubscriptionBadge(remainingDays)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dispatch(openUpdateModal(admin))}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
