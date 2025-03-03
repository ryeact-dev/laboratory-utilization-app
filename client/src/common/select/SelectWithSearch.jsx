import { useState } from "react";

import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

export default function SelectWithSearch({
  noResultText,
  placeholder,
  dataArray = [{ label: "", value: "" }],
  onSelectChange,
  fieldName,
  fieldValue,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="select-41"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
          >
            <span
              className={cn(
                "truncate",
                !fieldValue && "text-xs font-thin italic text-gray-100/80",
              )}
            >
              {fieldValue
                ? dataArray.find((data) => data.value === fieldValue)?.label
                : placeholder}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              className="placeholder:text-xs placeholder:font-thin"
              placeholder={placeholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{noResultText}</CommandEmpty>
              <CommandGroup>
                {dataArray
                  .filter((item) =>
                    item.label.toLowerCase().includes(search.toLowerCase()),
                  )
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((data) => (
                    <CommandItem
                      key={data.value}
                      value={data.label}
                      onSelect={() => {
                        onSelectChange(fieldName, data.value);
                        setOpen(false);
                      }}
                    >
                      {data.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          fieldValue === data.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
