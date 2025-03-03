import { cn } from "@/lib/utils";

export default function PasswordStrength({ newPassword }) {
  const indicatorMap = [
    { strength: "Weak", className: "before:w-[30%] before:bg-secondary" },
    { strength: "Medium", className: "before:w-[65%] before:bg-primary" },
    { strength: "Strong", className: "before:w-[100%] before:bg-green-500" },
  ];

  const passLength = newPassword.length;
  const className =
    passLength <= 8
      ? indicatorMap[0]
      : passLength <= 15
        ? indicatorMap[1]
        : indicatorMap[2];

  const textColor =
    className.strength === "Weak"
      ? "text-secondary"
      : className.strength === "Medium"
        ? "text-primary"
        : "text-green-500";

  return (
    <div className="flex w-full items-center justify-center gap-2 px-2">
      <div className={`w-16 text-center text-sm ${textColor}`}>
        {className.strength || "Weak"}
      </div>
      <div
        className={cn(
          "bg-grey-600 pass-indicator relative h-3 w-full rounded-3xl",
          className.className,
        )}
      ></div>
    </div>
  );
}
