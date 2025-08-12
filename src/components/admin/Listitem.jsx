import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Listitem = () => {
  return (
   <>
    <div className="min-h-screen bg-gray-100 p-10 ">
   <Table className="w-full max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-md shadow-md">
  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">SL.NO</TableHead>
      <TableHead className="w-[100px]">Name</TableHead>
      <TableHead>image</TableHead>
      <TableHead>Prime Category</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">1</TableCell>
      <TableCell className="font-medium">Burger</TableCell>
      <TableCell>img</TableCell>
      <TableCell>veg</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
     <TableRow>
      <TableCell className="font-medium">1</TableCell>
      <TableCell className="font-medium">Burger</TableCell>
      <TableCell>img</TableCell>
      <TableCell>veg</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
 <div>
        <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
    </div>
    </div>
   
   </>
  )
}

export default Listitem
