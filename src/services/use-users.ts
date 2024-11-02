import { User } from "@/schemas/user";
import { useState, useEffect } from "react";
import { debounce } from "./debounce";

type sortingType = 'name' | 'email'

const debounceWrapper = debounce(300); // 850ms

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterString, setFilterString] = useState('');
  const [currentUserInfo, setCurrentUserInfo] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, updateShowModal ] = useState<boolean>(false)
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [allUsersCount, setAllUsersCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [sortField, setSortField] = useState<sortingType>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // BASE API Endpoint URL pointing to Supabase server
  const API_URL = 'https://chclkyygvktplmkjhsbc.supabase.co/rest/v1/users';

  const apiRequest = async (url: string = API_URL, payload?: User) => {
    try {
      let opts: any = {
        method: !payload ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY2xreXlndmt0cGxta2poc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NDgyMjEsImV4cCI6MjA0NjEyNDIyMX0.Krp_wfhVUZ0jLe1qEsBkWGPBL6i8dW8UJigzFOTf6-M',
          }
      }
      if (payload) {
        opts.body = JSON.stringify(payload)
      }
      const response = await fetch(url, opts);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (payload) {
        // Send true since Supabase POST requests do not return JSON response. 
        return true;
      }
      const data = await response.json();
      return data;
    } catch (e){
      setError("Network request failed.");
      setTimeout( () => setError(''), 3000)
    } finally {
      // setLoading(false);
    }
  };

  const getSearchUrl = (columns: string = '*') => {
    // Search URL is needed for both fetching the users data and calculating pagination information for filtered users 
    let queryString = `?select=${columns}`;
    // Add filtering query
    if (filterString) queryString += `&or=(name.ilike.*${filterString}*,email.ilike.*${filterString}*)`
    return API_URL + queryString;
  }

  const fetchTotalCount = async () => {
    // Supabase doesn't send the total itmes count in the basic fetch API
    // This functions fetches all contents of the name column and uses it to get the total rows count
    let maxNameRows = await apiRequest(getSearchUrl('id'))
    const totalRows = maxNameRows.length;
    if (allUsersCount == 0) setAllUsersCount(totalRows);
    setUsersCount(totalRows);
    setTotalPages(Math.ceil(totalRows / pageSize));
  };

  const fetchUsers = async () => {
    setLoading(true);
    let requestUrl = getSearchUrl();
    // Add sorting query
    if(sortField) requestUrl += `&order=${sortField}.${sortDirection}`
    // Add pagination query
    requestUrl += `&offset=${(currentPage - 1) * pageSize}&limit=${pageSize}`
    const data = await apiRequest(requestUrl)
    setUsers(data);
    setLoading(false);
  };

  const viewUser = async (userId: number) => {
    const userInfo = await apiRequest(`${API_URL}?id=eq.${userId}`);
    if (userInfo?.length) {
      setCurrentUserInfo(userInfo[0]);
      updateShowModal(true);
    }
  }

  const addNewUser = async (user: User) => {
    const response = await apiRequest(API_URL, user);
    if(!response) {
      return;
    }

    // Since the Supabase POST call doesn't return the success response, manually add the ID information to the added user.
    user.id = allUsersCount + 1;

    // Since post call doesn't update the server database, update users data client side 
    setUsers([user, ...users]);
    setAllUsersCount(allUsersCount + 1)
    setUsersCount(usersCount + 1)
    setSortField(undefined) // Remove sorting so new data appears on top of table
    setToastMessage(`User ${user.name} successfully added!`)
    setTimeout( () => setToastMessage(''), 3000);
    closeModal();
  }

  const filterUsers = (filterString: string) => {
    setCurrentPage(1)
    setFilterString(filterString)
  }

  const sortTable = (fieldName: 'name' | 'email') => {
    const newSortDirection = fieldName !== sortField ? 'asc' : (sortDirection === 'desc' ? 'asc' : 'desc');
    setSortField(fieldName);
    setSortDirection(newSortDirection);
  };

  const updatePageSize = (newPagesize: number) => {
    setCurrentPage(1);
    setPageSize(newPagesize);
    setTotalPages(Math.ceil(usersCount / newPagesize));
  }

  const closeModal = () => {
    setCurrentUserInfo(null);
    setShowAddUserModal(false);
    updateShowModal(false)
  }

  useEffect(() => {
    // Fetch only user records on pagination/ sort actions
    debounceWrapper( () => {
      fetchUsers();
    })
  }, [currentPage, pageSize, sortField, sortDirection])


  useEffect(() => {
    // Fetch users and filtred user-count info on search action
    debounceWrapper( () => {
      fetchUsers();
      fetchTotalCount();  
    })
  }, [filterString]);



  return { 
    users, currentUserInfo, showModal, showAddUserModal, toastMessage, usersCount, totalPages, currentPage, pageSize, sortField, sortDirection, loading, error,
    mutations: { 
      filterUsers, viewUser, closeModal, addNewUser, setShowAddUserModal, setCurrentPage, setTotalPages, updatePageSize, sortTable
    } };
};

export { useUsers };
