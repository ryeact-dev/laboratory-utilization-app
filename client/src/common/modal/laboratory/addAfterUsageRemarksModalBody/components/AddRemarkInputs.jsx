import SelectItems from "@/common/select/SelectIems";
import { Button } from "@/common/ui/button";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import {
  COMPUTING_LAB_REMARKS,
  NON_COMPUTING_LAB_REMARKS,
} from "@/globals/initialValues";
import { LoaderCircle, Plus } from "lucide-react";

export default function AddRemarkInputs({ form, isComputingLab, isPending }) {
  const { register, setValue, watch } = form;

  const remark = watch("remark");

  const subjectRemarks = isComputingLab
    ? COMPUTING_LAB_REMARKS
    : NON_COMPUTING_LAB_REMARKS;

  const isUnitNumberDisable =
    COMPUTING_LAB_REMARKS.slice(2, 12).some((item) => item.value === remark) ||
    remark === "" ||
    remark === "No problems found";

  const onInputValueChange = (field, evt) => {
    const value = evt.target.value;
    setValue(field, Number(value));
  };

  // RENDER SECTION
  return (
    <article className="-mt-3">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex-[2]">
          <Label>Type of Remark</Label>
          <SelectItems
            onValueChange={(value) => setValue("remark", value)}
            value={remark}
            dataArray={subjectRemarks}
            placeholder="Select a remark"
            className={"w-full"}
          />
        </div>

        {isComputingLab && (
          <div className="flex-1">
            <Label>Unit No.</Label>
            <Input
              id="unit_no"
              name="unit_no"
              onChange={(evt) => onInputValueChange("unit_no", evt)}
              type="number"
              min={0}
              placeholder="unit no."
              disabled={
                remark === "" ||
                remark === "No problems found" ||
                remark === "Internet Speed"
              }
            />
          </div>
        )}

        {isComputingLab && (
          <div className="flex-1">
            <Label>Ticket No.</Label>
            <Input
              {...register("ticket_no")}
              placeholder="Ticket No."
              disabled={
                remark === "" ||
                remark === "No problems found" ||
                remark === "Internet Speed"
              }
            />
          </div>
        )}
      </div>
      <div className="mt-1 flex-1">
        <Label>Description</Label>
        <Input
          {...register("description")}
          min={0}
          type={remark === "Internet Speed" ? "number" : "text"}
          placeholder="Type here"
          disabled={isUnitNumberDisable}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Label className="text-base text-secondary">Utilization Remarks</Label>
        <Button className="w-24" size="sm" variant="secondary" type="submit">
          {isPending ? (
            <>
              <LoaderCircle
                className="-ms-1 me-2 animate-spin"
                strokeWidth={2}
                aria-hidden="true"
              />
              Adding
            </>
          ) : (
            <>
              <Plus strokeWidth={2.5} />
              Add
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
