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
import { EyeOpenIcon } from "@radix-ui/react-icons"
import Toast from "@/components/ui/toast";
import Pagination from "@/components/ui/pagination";

export const UsersTable = () => {
  const { loading, users, currentUserInfo, showModal, showAddUserModal, toastMessage, totalPages, currentPage, pageSize, sortField, sortDirection, error, mutations } = useUsers();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortHeader = (fieldName: string) => 
    <TableHead className={cn({"text-white": sortField == fieldName})}>
        <button className="flex gap-2 items-center capitalize focus:shadow-none hover:text-white" onClick={() => mutations.sortTable(fieldName)}>
          {fieldName}
          <span>
            {sortField !== fieldName ? '' : sortDirection == 'asc' ? '↑' : '↓'}
          </span>
        </button>
    </TableHead>
    
  return (
    <>
      <SearchBar onChange={mutations.filterUsers}/>
      <Table>
        <TableCaption>{users.length ? "In2Events list of users." : "No users found."}</TableCaption>
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
            <TableCell colSpan={5} className="text-center"> <button className="focus:outline-none focus:shadow-none" onClick={() => mutations.setShowAddUserModal(true)}> + Add New User</button></TableCell>
          </TableRow>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
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
      <Toast message={toastMessage} />
    </>
  );
};
