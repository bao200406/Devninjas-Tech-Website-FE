"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/orderHistory" ||
    pathname === "/checkout/success" ||
    pathname === "/forgotPassword" ||
    pathname === "/changePassword" ||
    pathname === "/account" ||
    pathname.startsWith("/admin");

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}