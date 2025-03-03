import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export default function Information({ className, title, message }) {
  return (
    <div
      className={cn(
        "my-2 flex w-full items-center justify-start gap-2 rounded-lg bg-sky-500/10 p-2",
        className,
      )}
    >
      <Info size={30} strokeWidth={2} />
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs opacity-85">{message}</p>
      </div>
    </div>
  );
}
