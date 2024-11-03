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
import { NewUserForm } from "@/components/new-user-form";
import { EyeOpenIcon, PersonIcon } from "@radix-ui/react-icons"
import Toast from "@/components/ui/toast";
import Pagination from "@/components/ui/pagination";
import { User } from "@/schemas/user";
import { Spinner } from "@/components/ui/animated-spinner";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TANSTACK_USERS_KEY, tanstackHandler } from "@/services/tanstack-handler";
import { useEffect, useState } from "react";
import { debounce } from "@/services/debounce";

const handler = tanstackHandler()
const debounceWrapper = debounce(300); // 300ms

export const UsersTable = () => {

  const queryClient = useQueryClient();
  const { isFetching: tanstackLoading, error, data } = useQuery({
    queryKey: [TANSTACK_USERS_KEY],
    queryFn: () => handler.fetchUsers(),
    initialData: handler.initialState,
    enabled: true,
  });

  const  [loading, setLoading ] = useState<boolean>(false)
  const [ showUsersInfoModal, setShowUserInfoModal ] = useState<boolean>(false)
  const [ showAddUserModal, setShowAddUserModal ] = useState<boolean>(false)
  const [ showNewUser, setShowNewUser ] = useState<boolean>(false)

  const { users, searchTerm, pageSize, usersCount, currentPage, totalPages, sortField, sortDirection, currentUserInfo, addedUser } = data;

  useEffect(() => {
    setShowUserInfoModal(!!currentUserInfo)
  }, [currentUserInfo])

  useEffect(() => {
    // Remove loadingscreen (reduced opacity) after pagination/search api response is compeleted
    setLoading(false);
    // Remove extra new-user row after table re-render
    setShowNewUser(false);
  }, [users, sortDirection, searchTerm, pageSize ])

  useEffect ( () => {
    if (!!addedUser) {
      setShowNewUser(true);
      setShowAddUserModal(false);  
    }
  }, [addedUser])

  const applyFilters = (page: number, size: number, searchTerm: string = '', sortBy: string = sortField, order: string = sortDirection) => {
    setLoading(true); // Show component-level loading screen (reduced opacity) when filters are applying. This loadscreen is not for fetch-user details or post call
    const offset = (page - 1) * size;
    const limit = size;
    handler.handleRefetch(
      queryClient, 
      { offset, limit, searchTerm, sortBy, order },
      {currentPage: page, pageSize: size, searchTerm, sortField: sortBy, sortDirection: order } 
    )
  }

  const filterUsers = (keyword: string) => {
    debounceWrapper( () => {
      applyFilters(1, pageSize, keyword );
    })
  }

  const sortTable = (columnName: 'name' | 'email' | '') => {
    const newSortDirection = columnName !== sortField 
      ? 'asc' 
      : sortDirection === 'asc' 
        ? 'desc' 
        : '';
    if (!newSortDirection) columnName = ''
    applyFilters(1, pageSize, searchTerm,  columnName, newSortDirection);
  }

  const viewUserDetails = (id?: number) => {
    handler.handleRefetch(queryClient, { id })
  }

  const addNewUser = (user: User) => {
    handler.addNewUser(queryClient, user);    
  }

  const sortHeader = (fieldName: 'name' | 'email') => (
    <TableHead>
      <button className="flex gap-2 items-center w-full capitalize focus:shadow-none hover:text-accent" onClick={() => sortTable(fieldName)}>
        <span className={cn({"text-secondary": sortField == fieldName})}>
          {fieldName}
        </span>
        <span className={sortDirection == 'asc' && sortField == fieldName ? 'text-secondary' : 'text-muted-foreground'}>↑</span>
        <span className={sortDirection == 'desc' && sortField == fieldName ? 'text-secondary' : 'text-muted-foreground'}>↓</span>
      </button>
    </TableHead>
  )

  const userCells = (user: User) => (
    <>
      <TableCell className="font-medium">{user.id}</TableCell>
      <TableCell> <PersonIcon className="inline" /> {user.name}</TableCell>
      <TableCell className="hidden md:!table-cell">{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <button className="hover:text-accent focus:shadow-none" onClick={() => viewUserDetails(user?.id)}>
          <EyeOpenIcon />
        </button>
      </TableCell>
    </>);

  return (
    <div className={cn("flex flex-col", {"opacity-80 pointer-events-none": loading})}>
      <SearchBar className="order-1" currentFilter={searchTerm} onChange={filterUsers}/>
      <Table className="order-2 max-h-[70dvh] md:!max-h-max">
        <TableCaption>{loading || tanstackLoading ? "Loading..." : (users?.length ? `Showing ${users?.length} of ${usersCount} user records found.` : "No users found.")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            {sortHeader('name')}
            {/* Hide username column for mobile screens */}
            <TableHead className="hidden md:!table-cell">Username</TableHead>
            {sortHeader('email')}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center"> <button className="w-full focus:outline-none focus:shadow-none" onClick={() => setShowAddUserModal(true)}> + Add New User</button></TableCell>
          </TableRow>
          {users.length == 0 && tanstackLoading && 
            <TableRow>
              <TableCell colSpan={5}>
                <Spinner />
              </TableCell>
            </TableRow>
          }
          {addedUser && showNewUser && (
            <TableRow className="text-emerald-200">
              {userCells(addedUser)}
            </TableRow>)}
          {users?.map((user:User) => (
            <TableRow key={user.id}>
              {userCells(user)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        className="order-1 md:!order-3 mb-4"
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => applyFilters(page, pageSize, searchTerm)}
        onSizeChange={(size) => applyFilters(1, size, searchTerm)} 
      />
      {showUsersInfoModal && (
        <Modal title={showAddUserModal ? 'Add User' : currentUserInfo?.name} onClose={() => setShowUserInfoModal(false)}> 
        {currentUserInfo && <UserInfo user={currentUserInfo} />}
        </Modal>
      )}
      {showAddUserModal && (
        <Modal title={showAddUserModal ? 'Add User' : currentUserInfo?.name} onClose={() => setShowAddUserModal(false)}> 
          {showAddUserModal && <NewUserForm onSave={addNewUser} />}
        </Modal>
      )}
      <Toast isError={!!error} message={( addedUser ? `User ${addedUser.name} successfully added!` :  error?.toString()) || ""} />
    </div>
  );
};
