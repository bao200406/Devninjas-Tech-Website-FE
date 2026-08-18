import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Store,
} from "lucide-react";

const stores = [
  {
    name: "DevNinjas Store - Hồ Chí Minh",
    address: "Hồ Chí Minh, Việt Nam",
    phone: "Hotline hỗ trợ khách hàng",
    time: "08:00 - 21:00",
  },
  {
    name: "DevNinjas Store - Hà Nội",
    address: "Hà Nội, Việt Nam",
    phone: "Hotline hỗ trợ khách hàng",
    time: "08:00 - 21:00",
  },
];

export default function StoresPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">

      {/* HEADER */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 xl:px-0 py-12">

          <p className="text-sm font-medium text-[#0052A3] mb-2">
            DEVNINJAS TECHNOLOGY STORE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hệ thống cửa hàng
          </h1>

          <p className="text-gray-500 max-w-2xl leading-7">
            Tìm hiểu thông tin hệ thống cửa hàng và địa điểm hỗ trợ
            khách hàng của DevNinjas.
          </p>

        </div>
      </section>

      {/* STORES */}
      <section className="container mx-auto px-6 xl:px-0 py-12">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
            <Store
              size={23}
              className="text-[#0052A3]"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Địa điểm cửa hàng
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Thông tin tham khảo
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {stores.map((store, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >

              <h3 className="text-lg font-bold text-gray-900 mb-5">
                {store.name}
              </h3>

              <div className="space-y-4">

                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    className="text-[#0052A3] mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Địa chỉ
                    </p>

                    <p className="text-sm text-gray-600">
                      {store.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock
                    size={20}
                    className="text-[#0052A3] mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Giờ hoạt động
                    </p>

                    <p className="text-sm text-gray-600">
                      {store.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={20}
                    className="text-[#0052A3] mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Liên hệ
                    </p>

                    <p className="text-sm text-gray-600">
                      {store.phone}
                    </p>
                  </div>
                </div>

              </div>

              <button
                type="button"
                className="mt-6 w-full flex items-center justify-center gap-2 border border-[#0052A3] text-[#0052A3] px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
              >
                <Navigation size={17} />
                Xem vị trí
              </button>

            </div>
          ))}

        </div>

        {/* SUPPORT */}
        <div className="mt-10 bg-[#0052A3] rounded-xl p-8 text-center text-white">

          <h2 className="text-2xl font-bold mb-3">
            Cần tìm địa điểm hỗ trợ?
          </h2>

          <p className="text-blue-100 mb-6">
            Liên hệ với DevNinjas để được hỗ trợ thêm về hệ thống cửa hàng.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-[#0052A3] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Liên hệ với chúng tôi
          </Link>

        </div>

      </section>

    </main>
  );
}