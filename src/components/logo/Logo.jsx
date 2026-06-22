import Image from "next/image";

export default function Logo() {
  return (
<div className="flex items-center gap">
  <Image
    src="/img/195cdd77-d2e9-4192-bef6-4dbf82cc7b50.png"
    alt="DevNinjas Logo"
    width={80}
    height={80}
    className="object-contain"
  />

  <div className="-ml-2">
    <h2 className="text-xl font-extrabold text-[#0052A3]">
      DevNinjas
    </h2>

    <p className="text-[10px] uppercase tracking-[4px] text-[#3B82F6]">
      Technology Store
    </p>
  </div>
</div>
  );
}