type User = {
  id: string;
  email: string;
  name: string | null;
};

export default function UserList({ users }: { users: User[] }) {
  return (
    <ul className="space-y-3 rounded-3xl border border-white/10 bg-white/6 p-6 text-white shadow-lg backdrop-blur">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
        >
          <div>
            <p className="font-medium">{user.name ?? "Unnamed user"}</p>
            <p className="text-sm text-white/60">{user.email}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-white/40">
            User
          </span>
        </li>
      ))}
    </ul>
  );
}
