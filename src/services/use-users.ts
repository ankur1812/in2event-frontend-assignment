import { User } from "@/schemas/user";
import { useState, useEffect } from "react";

const useUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserInfo, setCurrentUserInfo] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, updateShowModal ] = useState<boolean>(false)
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("")

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
    debugger;
    user.id = allUsers.length; // Generqte id client-side
    const response = await fetchDataFromApi(`https://jsonplaceholder.typicode.com/users/`, 'POST', user);
    setUsers([user, ...users.slice(0, users.length - 1)])
    setAllUsers([user, ...allUsers]);
    setToastMessage(`User ${user.username} successfully added!`)
    closeModal();
  }

  const closeModal = () => {
    setCurrentUserInfo(null);
    setShowAddUserModal(false);
    updateShowModal(false)
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, currentUserInfo, showModal, showAddUserModal, toastMessage, loading, error, mutations: { filterUsers, viewUser, closeModal, addNewUser, setShowAddUserModal } };
};

export { useUsers };
