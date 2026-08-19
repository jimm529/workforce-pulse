import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        {children}
      </main>
    </div>
  );
}