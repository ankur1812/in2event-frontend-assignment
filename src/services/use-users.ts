import { User } from "@/schemas/user";
import { useState, useMemo, useEffect } from "react";

type sortingType = 'name' | 'email'

const useUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filterString, setFilterString] = useState('');
  const [currentUserInfo, setCurrentUserInfo] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, updateShowModal ] = useState<boolean>(false)
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortField, setSortField] = useState<sortingType>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const fetchDataFromApi = async (url: string, method: 'GET' | 'POST' = 'GET', body = null) => {
    try {
      let opts: any = {
        method,
        headers: { 'Content-Type': 'application/json', }
      }
      if (body) {
        opts.body = JSON.stringify(body)
      }
      const response = await fetch(url, opts);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch {
      setError("Failed to fetch user(s)");
      setTimeout( () => setError(''), 3000)
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    let data = await fetchDataFromApi("https://jsonplaceholder.typicode.com/users");
    setAllUsers(data);
    setLoading(false);
  };

  const viewUser = async (userId: number) => {
    let userInfo = await fetchDataFromApi(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!userInfo) { // Since API fails for client-side records, fallback from existing data
      userInfo = allUsers.find( (u:User) => u.id == userId)
    }
    if (!!userInfo) {
      if (!userInfo) return;
      setCurrentUserInfo(userInfo);
      updateShowModal(true);
    }
  }

  const filterUsers = (filterString: string) => {
    setFilterString(filterString)
  }

  const addNewUser = async (user: User) => {
    user.id = allUsers.length + 100; // Generqte id client-side
    const response = await fetchDataFromApi(`https://jsonplaceholder.typicode.com/users/`, 'POST', user);
    if(!response) return;
    // Workaround for client-side update.
    // Since post call doesn't update the server database, upadte allUsers data client side 
    setAllUsers([user, ...allUsers]);
    setSortField(undefined) // Remove sorting so new data appears on top of table
    setToastMessage(`User ${user.name} successfully added!`)
    setTimeout( () => setToastMessage(''), 2000);
    closeModal();
  }

  const filteredUsers = useMemo(() => {
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(filterString.toLowerCase()) ||
        user.email.toLowerCase().includes(filterString.toLowerCase())
    );
  }, [allUsers, filterString]);

  const sortedUsers = useMemo(() => {
    if (!sortField) return [...filteredUsers];
    return [...filteredUsers].sort((a, b) => {
      if (a[sortField].toLowerCase() > b[sortField].toLowerCase()) return sortDirection === 'asc' ? 1 : -1;
      if (a[sortField].toLowerCase() < b[sortField].toLowerCase()) return sortDirection === 'asc' ? -1 : 1;
      return 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const start = pageSize * (currentPage - 1);
    const end = start + pageSize;
    return sortedUsers.slice(start, end);
  }, [sortedUsers, pageSize, currentPage]);


  const sortTable = (fieldName: 'name' | 'email') => {
    const newSortDirection = fieldName !== sortField ? 'asc' : (sortDirection === 'desc' ? 'asc' : 'desc');
    setSortField(fieldName);
    setSortDirection(newSortDirection);
  };


  const closeModal = () => {
    setCurrentUserInfo(null);
    setShowAddUserModal(false);
    updateShowModal(false)
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / pageSize));
    setCurrentPage(1); // Reset to page 1 whenever filtering or page size changes
  }, [filteredUsers, pageSize]);

  return { 
    users: paginatedUsers, currentUserInfo, showModal, showAddUserModal, toastMessage, totalCount: allUsers.length, totalPages, currentPage, pageSize, sortField, sortDirection, loading, error,
    mutations: { 
      filterUsers, viewUser, closeModal, addNewUser, setShowAddUserModal, setCurrentPage, setTotalPages, setPageSize, sortTable
    } };
};

export { useUsers };
