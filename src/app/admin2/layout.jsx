import Sidebar from "../../components/layoutadmin/sidebar";
import Header from "../../components/layoutadmin/Header";
import "../admin2-global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // DÒNG NÀY CỰC KỲ QUAN TRỌNG
export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* SIDEBAR: Cố định bên trái */}
      {/* w-64 là độ rộng chuẩn trong hình, hidden lg:flex để ẩn trên mobile */}
      <Sidebar />

      {/* VÙNG NỘI DUNG CHÍNH: Chứa Header và Content */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* HEADER: Sticky trên cùng của vùng content */}
        <Header />

        {/* CONTENT: Đây là nơi render page.jsx của các trang con */}
        <main className="p-4 md:p-8">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
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
