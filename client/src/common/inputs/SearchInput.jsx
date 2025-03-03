import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export default function SearchInput({
  register = null,
  field,
  className,
  onClickSearch,
  placeholder,
  isNeedSearchIcon = true,
  disabledSearch = false,
  ...rest
}) {
  return (
    <Label
      className={`relative flex items-center justify-between overflow-hidden rounded-lg border border-gray-700 bg-background/50 p-0`}
    >
      {register ? (
        <Input
          {...register(field)}
          placeholder={placeholder}
          className={className}
          {...rest}
        />
      ) : (
        <Input placeholder={placeholder} className={className} {...rest} />
      )}

      {isNeedSearchIcon && (
        <Button
          type="button"
          onClick={onClickSearch}
          className={`absolute right-0 h-full rounded-bl-none rounded-tl-none bg-secondary px-4 text-base font-medium tracking-wider text-secondary-foreground hover:bg-secondary/90`}
          disabled={disabledSearch}
        >
          <Search size={18} strokeWidth={3} />
        </Button>
      )}
    </Label>
  );
}
