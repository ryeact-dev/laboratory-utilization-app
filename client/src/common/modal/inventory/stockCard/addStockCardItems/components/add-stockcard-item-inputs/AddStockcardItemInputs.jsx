import { DatePicker } from "@/common/date-picker/DatePicker";
import ErrorText from "@/common/typography/ErrorText";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { format } from "date-fns";

const formattedDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export default function AddStockcardItemInputs({ form }) {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  return (
    <>
      <div className="mb-3 flex flex-col gap-1">
        <Label>Date Requested</Label>
        <DatePicker
          date={new Date(watch("date_requested"))}
          setDate={(date) => setValue("date_requested", new Date(date))}
          minDate={new Date("2020-08-01")}
          maxDate={new Date()}
          formattedDate={formattedDate}
          className={"w-48"}
          captionLayout="dropdown-buttons"
          fromYear={2020}
          toYear={2030}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-[2]">
          <Label>PRS Number</Label>
          <Input
            {...register("prs_number")}
            placeholder="PRS Number here"
            type="number"
            min={0}
          />
          <ErrorText>
            {errors?.prs_number ? errors?.prs_number.message : ""}
          </ErrorText>
        </div>
        <div className="flex-1">
          <Label>Quantity</Label>
          <Input
            {...register("item_quantity")}
            placeholder="Quantity here"
            type="number"
            step={0.1}
            min={1}
          />
          <ErrorText>
            {errors?.item_quantity ? errors?.item_quantity.message : ""}
          </ErrorText>
        </div>
      </div>

      {/* Receiving Section */}
      <div className="mb-3 mt-2 flex flex-col gap-1">
        <Label>Date Recieved</Label>
        <DatePicker
          date={new Date(watch("date_received"))}
          setDate={(date) => setValue("date_received", new Date(date))}
          minDate={new Date("2020-08-01")}
          maxDate={new Date()}
          formattedDate={formattedDate}
          className={"w-48"}
          captionLayout="dropdown-buttons"
          fromYear={2020}
          toYear={2030}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-[2]">
          <Label>MSIS Number</Label>
          <Input
            {...register("msis_number")}
            placeholder="MSIS Number here"
            type="number"
            min={0}
          />
          <ErrorText>
            {errors?.msis_number ? errors?.msis_number.message : ""}
          </ErrorText>
        </div>
        <div className={"flex-1"}>
          <Label>Received</Label>
          <Input
            {...register("item_received")}
            placeholder="Quantity here"
            type="number"
            step={0.1}
            min={1}
          />
          <ErrorText>
            {errors?.item_received ? errors?.item_received.message : ""}
          </ErrorText>
        </div>
      </div>
    </>
  );
}
