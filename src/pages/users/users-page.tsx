"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UsersTable } from "./users-table";

const queryClient = new QueryClient();

export default function UsersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container p-4">
        <h1 className="text-2xl font-bold mb-4">Users List</h1>
        <UsersTable />
      </div>
    </QueryClientProvider>
  );
}