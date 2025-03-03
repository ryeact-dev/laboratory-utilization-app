import { cn } from "@/lib/utils";

export default function NoRecordsFound({ children, className }) {
  return (
    <div className={cn("my-4 text-center text-base", className)}>
      {children}
    </div>
  );
}
