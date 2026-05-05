import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)] transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8 space-y-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;