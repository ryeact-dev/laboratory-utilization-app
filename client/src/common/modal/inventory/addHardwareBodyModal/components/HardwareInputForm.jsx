import { DatePicker } from "@/common/date-picker/DatePicker";
import SelectItems from "@/common/select/SelectIems";
import ErrorText from "@/common/typography/ErrorText";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { Textarea } from "@/common/ui/textarea";
import { HARDWARE_TYPE } from "@/globals/initialValues";
import { format } from "date-fns";

const startingDate = new Date("2010-01-01");
const maxDate = new Date(
  startingDate.getFullYear() + 15,
  startingDate.getMonth(),
  startingDate.getDate(),
);

const formattedDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};
export default function HardwareInputForm({ form }) {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  const onDateChange = (date) => {
    setValue("date_acquired", date);
  };

  // CUSTOM VALUES FOR SELECTED ITEM BECAUSE VALUES FROM FETCHED DATA IS NOT MATCHING THE SELECT ITEMS
  const itemType = HARDWARE_TYPE?.filter(
    (item) => item.label.toLowerCase() === watch("hardware_type").toLowerCase(),
  )[0]?.value;

  console.log(errors);

  return (
    <>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <Label>Date Acquired</Label>
        <DatePicker
          date={new Date(watch("date_acquired"))}
          setDate={(date) => onDateChange(date)}
          minDate={startingDate}
          maxDate={maxDate}
          formattedDate={formattedDate}
          className={"w-48"}
          captionLayout="dropdown-buttons"
          fromYear={2010}
          toYear={2030}
        />
      </div>
      <div className="mt-1 w-full">
        <div className="flex w-full items-start gap-3">
          <div className="flex-1 flex-col">
            <Label>Property No.</Label>
            <Input
              {...register("property_number")}
              placeholder="TA number here"
            />

            <ErrorText>
              {errors?.property_number ? errors?.property_number.message : ""}
            </ErrorText>
          </div>

          <div className="flex-1 flex-col">
            <Label>Hardware Type</Label>

            <SelectItems
              dataArray={HARDWARE_TYPE}
              value={itemType}
              onValueChange={(value) => setValue("hardware_type", value)}
              placeholder={"Select Type"}
              className={"w-full"}
            />

            <ErrorText>
              {errors?.hardware_type ? errors?.hardware_type.message : ""}
            </ErrorText>
          </div>
        </div>

        <div>
          <Label>Specifications</Label>
          <Textarea
            {...register("specs")}
            rows={3}
            placeholder="ACER Veriton I7, 4GB Memory, 500GB SSD"
            className="placeholder:text-xs placeholder:italic placeholder:text-gray-400"
          />

          <ErrorText>{errors?.specs ? errors?.specs.message : ""}</ErrorText>
        </div>
      </div>
    </>
  );
}
