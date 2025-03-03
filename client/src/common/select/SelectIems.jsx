import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SelectItems({
  onValueChange,
  dataArray,
  value,
  placeholder,
  placeholderWidth,
  selectContentClassName,
  needSubLabel = false,
  ...rest
}) {
  return (
    <Select onValueChange={onValueChange} value={value} {...rest}>
      <SelectTrigger className={cn(`w-60`, placeholderWidth)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={selectContentClassName}>
        {dataArray?.map((data, k) => {
          return (
            <SelectItem value={data.value} key={k}>
              <p>{data.label}</p>
              {needSubLabel && (
                <p className="text-xs text-foreground/70">{data.subLabel}</p>
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
