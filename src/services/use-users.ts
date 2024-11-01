import { User } from "@/schemas/user";
import { useState, useEffect } from "react";

type sortingType = 'name' | 'email' | null

const useUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserInfo, setCurrentUserInfo] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, updateShowModal ] = useState<boolean>(false)
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<sortingType>(null);
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
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    let data = await fetchDataFromApi("https://jsonplaceholder.typicode.com/users");
    setUsers(data);
    setAllUsers(data);
    setLoading(false);
  };

  const viewUser = async (userId: number) => {
    let userInfo = await fetchDataFromApi(`https://jsonplaceholder.typicode.com/users/${userId}`);
    setCurrentUserInfo(userInfo);
    updateShowModal(true);
  }

  const filterUsers = (filterString: string) => {
    filterString = filterString.toLowerCase();
    let filteredUsers = allUsers.filter( (user: User) => user.name.toLowerCase().includes(filterString) || user.email.toLowerCase().includes(filterString))
    setUsers(filteredUsers);
  }

  const addNewUser = async (user: User) => {
    user.id = allUsers.length + 100; // Generqte id client-side
    const response = await fetchDataFromApi(`https://jsonplaceholder.typicode.com/users/`, 'POST', user);
    setUsers([user, ...users.slice(0, users.length - 1)])
    setAllUsers([...allUsers, user]);
    setTotalPages(Math.ceil((allUsers.length + 1) / pageSize));
    setToastMessage(`User ${user.username} successfully added!`)
    closeModal();
  }

  const sortTable = (fieldName: 'name' | 'email') => {
    let newSortDirection : 'asc' | 'desc' = fieldName !== sortField ? 'asc' : (sortDirection == 'desc' ? 'asc' : 'desc')
    setSortDirection(newSortDirection)
    setSortField(fieldName)
    let sortedUsers = [...allUsers].sort((a: User, b: User) => {
      if (a[fieldName].toLowerCase() > b[fieldName].toLowerCase()) return newSortDirection == 'asc' ? 1 : -1
      else if (a[fieldName].toLowerCase() < b[fieldName].toLowerCase()) return newSortDirection == 'asc' ? -1 : 1
      else return 1
    })
    setAllUsers(sortedUsers);
    // setCurrentPage(1)
    setUsers(sortedUsers.slice(pageSize * (currentPage - 1), pageSize * currentPage))
  }
  const closeModal = () => {
    setCurrentUserInfo(null);
    setShowAddUserModal(false);
    updateShowModal(false)
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect( () => {
    setUsers(allUsers.slice(0, pageSize));
    setCurrentPage(1);
    setTotalPages(Math.ceil(allUsers.length / pageSize));
  }, [pageSize])

  useEffect( () => {
    setUsers(allUsers.slice( pageSize * (currentPage - 1), pageSize * currentPage));
  }, [currentPage])

  return { 
    users, currentUserInfo, showModal, showAddUserModal, toastMessage, totalPages, currentPage, pageSize, sortField, sortDirection, loading, error,
    mutations: { 
      filterUsers, viewUser, closeModal, addNewUser, setShowAddUserModal, setCurrentPage, setTotalPages, setPageSize, sortTable
    } };
};

export { useUsers };
