import { TERM_AND_SEM, SEMESTERS } from "@/globals/initialValues";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";

export default function SelectSchedule({
  selectedTermAndSem,
  setSearchParams,
  isSemestral = false,
}) {
  const onClassScheduleChange = (value) => {
    let termSemValue = value;

    setSearchParams((prev) => {
      prev.set("termsem", termSemValue);
      return prev;
    });
  };

  let termSemSelection = TERM_AND_SEM;

  if (isSemestral) {
    termSemSelection = SEMESTERS;
  }

  return (
    <Select
      onValueChange={onClassScheduleChange}
      defaultValue={selectedTermAndSem}
    >
      <SelectTrigger className={`w-60`}>
        <SelectValue placeholder="Select Laboratory" />
      </SelectTrigger>
      <SelectContent>
        {termSemSelection.map((value, k) => {
          return (
            <SelectItem value={value} key={k}>
              {value}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
