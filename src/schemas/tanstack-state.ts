import { User } from "./user";

export interface TanstackState {
    users: User[],
    pageSize: number,
    currentPage: number,
    totalPages: number,
    searchTerm: string,
    sortField: string,
    sortDirection: string,
    usersCount: number,
    allUsersCount: number,
    currentUserInfo: User | null,
    addedUser: User | null
}