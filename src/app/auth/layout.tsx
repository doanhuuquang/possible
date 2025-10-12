import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full max-w-7xl min-h-[100vh] max-h-[1500px] m-auto px-3 py-5 gap-10">
      <div className="w-full h-full flex flex-col justify-between gap-10 bg-[url(/assets/images/bg-auth.jpg)] bg-center bg-cover max-h-[900px] rounded-xl p-5 my-auto">
        <Link
          href={"/"}
          className="w-fit rounded-full bg-black/20  text-white  py-2 px-3 text-xs flex items-center gap-2"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>

        <p className="text-4xl font-bold text-white uppercase">
          Bạn có thể trì hoãn, nhưng thời gian thì không
        </p>
      </div>
      <main className="w-full h-full flex justify-center items-center">
        {children}
      </main>
    </div>
  );
}
