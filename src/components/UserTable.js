import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function UserTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Dernière présence</TableHead>
          <TableHead>Heure d&apos;arrivée</TableHead>
          <TableHead>Heure de départ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell>{user.fullName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.lastPresence?.date}</TableCell>
            <TableCell>{user.lastPresence?.arrivalTime}</TableCell>
            <TableCell>{user.lastPresence?.departureTime}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
