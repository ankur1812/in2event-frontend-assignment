import { User } from "@/schemas/user";
import { QueryClient } from "@tanstack/react-query";

const initialState: any = {
  users: [],
  pageSize: 10,
  currentPage: 1,
  totalPages: 1,
  sortField: '',
  sortDirection: '',
  usersCount: 0,
  allUsersCount: 0,
  currentUserInfo: null,
  addedUser: null
};

const fetchUsers = async (queryObject: any = { limit: 10, offset: 0 }) => {
  const queryParams = new URLSearchParams(queryObject)
  const response = await fetch(`/api/users?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const { users, totalCount } =  (await response.json());
  return {
    ...initialState,
    users,
    totalPages: Math.ceil(totalCount / initialState.pageSize),
    usersCount: totalCount,
    allUsersCount: totalCount,
  }
}

const addUser = async (payload: User) => {
  // Direclty call the Supabase APIs to make the retch request
  const response = await fetch('https://chclkyygvktplmkjhsbc.supabase.co/rest/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY2xreXlndmt0cGxta2poc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NDgyMjEsImV4cCI6MjA0NjEyNDIyMX0.Krp_wfhVUZ0jLe1qEsBkWGPBL6i8dW8UJigzFOTf6-M',
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return { "message": "Success", user: payload};
}

const updateCurrentUserInfo = (previousState: any, userInfo: User) => {
  return  {
    ...previousState,
    currentUserInfo: userInfo
  };
}

const addNewUser = async (queryClient: QueryClient, user: User) => {
  const response = await addUser(user);
  if (!response) return;
  const previousState: any = queryClient.getQueryData([TANSTACK_USERS_KEY]) || {};
  const updatedState: any = {
    ...previousState,
    usersCount: previousState.usersCount + 1,
    addedUser: {
      ...response.user,
      id: previousState.allUsersCount + 1 // Manually add the expected ID, Supabase doesn't return the ID details on POST request
    }
  }
  debugger;
  queryClient.setQueryData([TANSTACK_USERS_KEY], updatedState);
}

const handleRefetch = async (queryClient: QueryClient, filters: any, additionalStateUpdates: any = null) => {
  const usersNewData = await fetchUsers(filters);
  const previousState: any = queryClient.getQueryData([TANSTACK_USERS_KEY]) || {};
  let updatedState;
  if (filters.id) {
    // just update currentUserInfo if fetch-by-id
    updatedState = updateCurrentUserInfo(previousState, usersNewData.users[0]);
  }
  else {
    // Else update table-view information
    updatedState = {
      ...previousState,
      ...additionalStateUpdates,
      addedUser: null,
      users: usersNewData.users,
      usersCount: usersNewData.usersCount,
    };
    updatedState.totalPages = Math.ceil(updatedState.usersCount / updatedState.pageSize)
  }
  queryClient.setQueryData([TANSTACK_USERS_KEY], updatedState);
}

export const TANSTACK_USERS_KEY = 'tanstack_users'

export const tanstackHandler = () => ({
  tanstackUsersKey: TANSTACK_USERS_KEY,
  initialState,
  fetchUsers,
  addNewUser,
  handleRefetch
})
