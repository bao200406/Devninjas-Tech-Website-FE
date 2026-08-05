import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 cursor-pointer group inline-flex">
      <Image
        src="/img/195cdd77-d2e9-4192-bef6-4dbf82cc7b50.png"
        alt="DevNinjas Logo"
        width={80}
        height={80}
        className="object-contain"
      />

      <div className="-ml-2">
        <h2 className="text-xl font-extrabold text-[#0052A3] group-hover:opacity-90 transition-opacity">
          DevNinjas
        </h2>

        <p className="text-[10px] uppercase tracking-[4px] text-[#3B82F6]">
          Technology Store
        </p>
      </div>
    </Link>
  );
}