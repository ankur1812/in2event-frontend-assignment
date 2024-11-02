"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/searchbar";
import { Modal } from "@/components/ui/modal";
import { UserInfo } from "@/components/userinfo";
import { useUsers } from "@/services/use-users";
import { NewUserForm } from "@/components/new-user-form";
import { EyeOpenIcon, PersonIcon } from "@radix-ui/react-icons"
import Toast from "@/components/ui/toast";
import Pagination from "@/components/ui/pagination";
import { User } from "@/schemas/user";
import { Spinner } from "@/components/ui/animated-spinner";

export const UsersTable = () => {
  const { loading, users, currentUserInfo, showModal, showAddUserModal, toastMessage, totalCount, totalPages, currentPage, pageSize, sortField, sortDirection, error, mutations } = useUsers();

  const sortHeader = (fieldName: string) => (
    <TableHead>
      <button className="flex gap-2 items-center capitalize focus:shadow-none hover:text-white" onClick={() => mutations.sortTable(fieldName)}>
        <span className={cn({"text-secondary": sortField == fieldName})}>
          {fieldName}
        </span>
        <span className={sortDirection == 'asc' && sortField == fieldName ? 'text-secondary' : 'text-muted-foreground'}>↑</span>
        <span className={sortDirection == 'desc' && sortField == fieldName ? 'text-secondary' : 'text-muted-foreground'}>↓</span>
      </button>
    </TableHead>
  )
    
  return (
    <div className={cn({"opacity-80 pointer-events-none": loading})}>
      <SearchBar onChange={mutations.filterUsers}/>
      <Table>
        <TableCaption>{users.length ? `Showing ${users.length} of ${totalCount} user records` : (loading ? "Loading..." : "No users found.")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            {sortHeader('name')}
            <TableHead>Username</TableHead>
            {sortHeader('email')}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center"> <button className="w-full focus:outline-none focus:shadow-none" onClick={() => mutations.setShowAddUserModal(true)}> + Add New User</button></TableCell>
          </TableRow>
          {!users.length && loading && 
            <TableRow>
              <TableCell colSpan={5}>
                <Spinner />
              </TableCell>
            </TableRow>
          }
          {users?.map((user:User, i: number) => (
            <TableRow key={user.id} className={cn({"text-emerald-400": toastMessage && toastMessage.includes(user.name) })}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell> <PersonIcon className="inline" /> {user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell> <button className="hover:text-white focus:shadow-none" onClick={() => mutations.viewUser(user.id)}><EyeOpenIcon /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => mutations.setCurrentPage(page)}
        onSizeChange={(size) => mutations.setPageSize(size)} 
      />
      {<Modal isOpen={showModal || showAddUserModal} title={showAddUserModal ? 'Add User' : currentUserInfo?.name} onClose={mutations.closeModal}> 
        {currentUserInfo && <UserInfo user={currentUserInfo} />}
        {showAddUserModal && <NewUserForm onSave={mutations.addNewUser} />}
      </Modal>}
      <Toast isError={!!error} message={toastMessage || error || ""} />
    </div>
  );
};
