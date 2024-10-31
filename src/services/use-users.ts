import { User } from "@/schemas/user";
import { useState, useEffect } from "react";

const useUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const filterUsers = (filterString: string) => {
    filterString = filterString.toLowerCase();
    let filteredUsers = allUsers.filter( (user: User) => user.name.toLowerCase().includes(filterString) || user.email.toLowerCase().includes(filterString))
    setUsers(filteredUsers);
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
        setAllUsers(data);
      } catch {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error, mutations: { filterUsers } };
};

export { useUsers };
