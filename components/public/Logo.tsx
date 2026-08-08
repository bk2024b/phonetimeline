import Image from "next/image";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-bold tracking-tight">
      <Image
        src="/logo-256.png"
        alt="PhoneTimeline"
        width={24}
        height={24}
        className="rounded-[6px]"
        priority
      />
      <span className={`hidden sm:inline ${light ? "text-white" : ""}`}>
        PhoneTimeline
      </span>
    </span>
  );
}
