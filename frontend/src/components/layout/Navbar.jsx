import { Bell, Moon, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">
      <h1>Dashboard</h1>

      <div className="nav-icons">
        <Bell size={22} />
        <Moon size={22} />
        <UserCircle size={30} />
      </div>
    </header>
  );
}