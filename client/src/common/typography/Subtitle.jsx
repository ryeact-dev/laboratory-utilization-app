import { cn } from "@/lib/utils";

function Subtitle({ className, children, ...rest }) {
  return (
    <div {...rest} className={cn("text-xl font-semibold", className)}>
      {children}
    </div>
  );
}

export default Subtitle;
