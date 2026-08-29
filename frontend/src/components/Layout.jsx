import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 flex-1 bg-linear-to-b from-white via-gray-200 to-gray-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
