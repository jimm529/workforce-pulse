import {
  LayoutDashboard,
  Users,
  BarChart3,
  Bot,
  FileText,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">Workforce Pulse</h2>

      <nav>
        <a href="#">
          <LayoutDashboard size={20} />
          Dashboard
        </a>

        <a href="#">
          <Users size={20} />
          Employees
        </a>

        <a href="#">
          <BarChart3 size={20} />
          Analytics
        </a>

        <a href="#">
          <Bot size={20} />
          AI Assistant
        </a>

        <a href="#">
          <FileText size={20} />
          Reports
        </a>

        <a href="#">
          <Settings size={20} />
          Settings
        </a>
      </nav>
    </aside>
  );
}