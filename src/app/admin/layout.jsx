import SideBar from "../../components/dashboard/Sidebar";
import HeaderAdmin from "../../components/dashboard/HeaderAdmin";
import "../admin-globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // DÒNG NÀY CỰC KỲ QUAN TRỌNG

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-admin-bg font-sans text-admin-text-main">
      {/* SIDEBAR */}
      <SideBar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <HeaderAdmin />

        {/* PAGE CONTENT */}
        <main className="p-8 animate-fade-in ">{children}</main>
        <ToastContainer
          position="top-right"
          autoClose={3000} // Thời gian chạy (3 giây)
          hideProgressBar={false} // HIỆN THANH PROCESS
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark" // Dashboard của bạn đang tone tối, dùng theme dark rất đẹp
        />
      </div>
    </div>
  );
}
