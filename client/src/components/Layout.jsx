import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-[#faf8ff] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8 space-y-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;