import { cn } from "@/lib/utils";

function ErrorText({ styleClass, children }) {
  return (
    <p
      className={cn(
        "h-4 pl-1 pt-1 text-xs font-normal tracking-wide text-primary",
        styleClass,
      )}
    >
      {children}
    </p>
  );
}
export default ErrorText;
