import { User } from "@/schemas/user";
import { useState, useEffect } from "react";

const useUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserInfo, setCurrentUserInfo] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, updateShowModal ] = useState<boolean>(false)


  const fetchDataFromApi = async (url: string) => {
    try {
      const response = await fetch(url);
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

  const closeModal = () => {updateShowModal(false)}

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, currentUserInfo, showModal, loading, error, mutations: { filterUsers, viewUser, closeModal } };
};

export { useUsers };
