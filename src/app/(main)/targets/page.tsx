"use client";

import CircularProgressBar from "@/components/shared/main/circular-progress-bar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const CircularProgressBars = ({ className }: { className?: string }) => {
  const outerSize = 600;
  const middleSize = 470;
  const innerSize = 340;

  const outerStroke = 60;
  const middleStroke = 60;
  const innerStroke = 60;

  return (
    <div
      className={cn("relative w-full", className)}
      style={{
        width: `${outerSize}px`,
        height: `${outerSize}px`,
      }}
    >
      <CircularProgressBar
        persentage={70}
        strokeColor="stroke-yellow-500"
        strokeWidth={outerStroke}
        radius={(outerSize - outerStroke * 2) / 2}
        className="-rotate-90 absolute top-0 left-0"
      />

      <CircularProgressBar
        persentage={90}
        strokeColor="stroke-orange-500"
        strokeWidth={middleStroke}
        radius={(middleSize - middleStroke * 2) / 2}
        className="-rotate-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <CircularProgressBar
        persentage={100}
        strokeColor="stroke-blue-500"
        strokeWidth={innerStroke}
        radius={(innerSize - innerStroke * 2) / 2}
        className="-rotate-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default function TargetsPage() {
  return (
    <div className="h-full w-full flex lg:flex-row flex-col ">
      {/* <div className="space-y-5 lg:w-1/2 w-full">
        <div className="space-y-10">
          <h1 className="uppercase text-5xl font-bold leading-tight">
            Đặt mục tiêu và <br /> hoàn thành.
          </h1>
        </div>

        <div className="w-full grow rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-400 dark:bg-green-500 text-green-950 font-semibold p-3 shrink-0 rounded-md hover:shadow-2xl shadow-green-500/50 hover:cursor-pointer transition-colors duration-300 ease-in-out">
              Từ bỏ thói quen xấu
            </div>
            <div className="border-1  p-3 shrink-0 rounded-md flex items-center justify-center hover:bg-accent/50 cursor-pointer transition-colors duration-300 ease-in-out">
              <Plus />
            </div>
          </div>
        </div>
      </div> */}

      <div className="w-full flex flex-col items-center justify-center">
        {/* Lời chào */}
        <div className="space-y-10">
          <h1 className="uppercase text-5xl font-bold leading-tight">
            Đặt mục tiêu và hoàn thành.
          </h1>
        </div>
        <CircularProgressBars className="lg:scale-100 md:scale-70 scale-50" />
      </div>
    </div>
  );
}

{
  /* Vòng tròn tiến độ */
}
// <div className="space-y-3 lg:w-1/2 w-full">
//   <CircularProgressBars className="mx-auto z-6" />
//   <div className="relative w-full">
//     <div className="w-full h-[200px] bg-gradient-to-b from-background/20  to-background/100 absolute z-5 -top-3"></div>
//     <CircularProgressBars className="mx-auto rotate-x-180 opacity-10" />
//   </div>
// </div>
