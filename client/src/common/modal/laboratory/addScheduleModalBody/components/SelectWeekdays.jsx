import { Checkbox } from "@/common/ui/checkbox";
import { Label } from "@/common/ui/label";

const WEEKDAYS = [
  { name: "Monday", data: "MO" },
  { name: "Tuesday", data: "TU" },
  { name: "Wednesday", data: "WE" },
  { name: "Thursday", data: "TH" },
  { name: "Friday", data: "FR" },
  { name: "Saturday", data: "SA" },
];
export function SelectWeekdays({
  selectedDays,
  setSelectedDays,
  isDisabled = false,
}) {
  const onSelectDay = (checked, data) => {
    if (checked) {
      setSelectedDays([...selectedDays, data]);
    } else {
      setSelectedDays(selectedDays.filter((day) => day !== data));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 rounded-md border p-2">
      {WEEKDAYS.map(({ name, data }) => (
        <div key={data} className="flex justify-start gap-2 py-1">
          <Checkbox
            id={name}
            checked={selectedDays.includes(data)}
            onCheckedChange={(checked) => onSelectDay(checked, data)}
            disabled={isDisabled}
          />
          <Label
            htmlFor={name}
            className="font-normal text-white hover:cursor-pointer"
          >
            {name}
          </Label>
        </div>
      ))}
    </div>
  );
}
