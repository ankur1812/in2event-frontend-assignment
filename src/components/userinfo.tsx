import React from "react";
import { User } from "@/schemas/user";
import {
    Table,
    TableBody,
    // TableCaption,
    TableCell,
    // TableHead,
    // TableHeader,
    TableRow,
} from "@/components/ui/table";
  
interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {

  const websiteUrl = (url:string | undefined) => !url ? "" : url.startsWith('https://') ? url : 'https://' + url;
  return (
    <Table>
    {/* <TableCaption>{user.name}</TableCaption> */}
    <TableBody>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>{user.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>{user.username}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>
            <a href={`mailto:${user.email}`}>{user.email}</a>
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Phone</TableCell>
          <TableCell>
            <a href={`tel:${user.phone}`}>{user.phone}</a>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Website</TableCell>
          <TableCell>
            <a target="_blank" href={`${websiteUrl(user.website)}`}>{user.website}</a>
          </TableCell>
        </TableRow>
        {user.address && (
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>{user.address.suite}, {user.address.street}, {user.address.city}, {user.address.zipcode}</TableCell>
          </TableRow>
        )}
        {user.company && (
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>{user.company.name} <span className="text-xs"> | {user.company.catchPhrase}</span></TableCell>
          </TableRow>
        )}
    </TableBody>
  </Table>
);
};

export { UserInfo };
