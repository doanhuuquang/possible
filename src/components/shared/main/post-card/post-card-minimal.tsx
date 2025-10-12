import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function PostCardMinimal({
  href,
  imgSrc,
  className,
}: {
  href: string;
  imgSrc: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block hover:no-underline relative w-[280px] h-[210px]",
        className
      )}
    >
      <Image
        fill
        loading="lazy"
        src={imgSrc}
        alt="Post image"
        className="w-full h-auto aspect-square object-cover rounded-md bg-gray-200"
      />
      <div></div>
    </Link>
  );
}
