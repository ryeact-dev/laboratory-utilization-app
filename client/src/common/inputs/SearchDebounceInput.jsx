import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function SearchDebounceInput({
  setterFunction,
  debounceTime = 500,
  placeholder,
  className,
  value: externalValue,
  onChange: externalOnChange,
  ...rest
}) {
  const [inputValue, setInputValue] = useState(externalValue || "");

  useEffect(() => {
    if (externalValue !== undefined) {
      setInputValue(externalValue);
    }
  }, [externalValue]);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setInputValue(value);
    externalOnChange?.(evt);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setterFunction(inputValue.trim());
    }, debounceTime);
    return () => clearTimeout(timeoutId);
  }, [inputValue, debounceTime]);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground opacity-80" />
      <Input
        type="search"
        placeholder={placeholder}
        className={cn(
          "pl-8 font-thin placeholder:text-xs placeholder:font-thin sm:w-[300px] md:w-[200px] lg:w-[300px]",
          className,
        )}
        value={inputValue}
        onChange={handleChange}
        {...rest}
      />
    </div>
  );
}
