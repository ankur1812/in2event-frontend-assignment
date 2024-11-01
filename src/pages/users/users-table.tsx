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
import { SearchBar } from "@/components/searchbar";
import { Modal } from "@/components/ui/modal";
import { UserInfo } from "@/components/userinfo";
import { useUsers } from "@/services/use-users";
import { NewUserForm } from "@/components/new-user-form";
import Toast from "@/components/ui/toast";

export const UsersTable = () => {
  const { loading, users, currentUserInfo, showModal, showAddUserModal, toastMessage, error, mutations } = useUsers();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <SearchBar onChange={mutations.filterUsers}/>
      <Table>
        <TableCaption>{users.length ? "A list of users." : "No users found."}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
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
              <TableCell> <button onClick={() => mutations.viewUser(user.id)}>View</button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(showModal || showAddUserModal) && <Modal isOpen={showModal || showAddUserModal} onClose={mutations.closeModal}> 
        {currentUserInfo && <UserInfo user={currentUserInfo} />}
        {showAddUserModal && <NewUserForm onSave={mutations.addNewUser} />}
      </Modal>}
      <Toast message={toastMessage} />
    </>
  );
};
