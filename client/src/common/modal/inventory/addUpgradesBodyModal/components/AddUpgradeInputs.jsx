import { format } from "date-fns";

import { DatePicker } from "@/common/date-picker/DatePicker";
import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";
import { Button } from "@/common/ui/button";
import { LoaderCircle, Plus } from "lucide-react";

const formattedDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export default function AddUpgradeInputs({
  onAddUpgradeMutation,
  form,
  isPending,
}) {
  const { setValue, watch, register } = form;

  const onDateChange = (fieldValue, date) => {
    setValue(fieldValue, new Date(date));
  };

  // RENDER SECTION
  return (
    <article className="-mt-3">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Label>Date</Label>
          <DatePicker
            date={new Date(watch("date_upgraded"))}
            setDate={(date) => onDateChange("date_upgraded", date)}
            minDate={new Date("2010-08-01")}
            formattedDate={formattedDate}
            captionLayout="dropdown-buttons"
            fromYear={2010}
            toYear={2030}
            className={"w-48"}
          />
        </div>
      </div>
      <div className="mt-1 flex-1">
        <Label>Description</Label>
        <Input {...register("upgrade_details")} placeholder="Type here" />
      </div>
      <div className="mb-3 mt-3 flex items-center justify-between">
        <Label className="text-base text-secondary">Upgrade List</Label>
        <Button
          variant="secondary"
          size="sm"
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle
                className="-ms-1 me-2 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Adding
            </>
          ) : (
            <>
              <Plus size={16} strokeWidth={2.5} />
              Add
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
