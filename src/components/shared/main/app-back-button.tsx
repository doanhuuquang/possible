import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AppBackButton({ url }: { url?: string }) {
  return (
    <Link href={url || "/"}>
      <ChevronLeft />
    </Link>
  );
}
