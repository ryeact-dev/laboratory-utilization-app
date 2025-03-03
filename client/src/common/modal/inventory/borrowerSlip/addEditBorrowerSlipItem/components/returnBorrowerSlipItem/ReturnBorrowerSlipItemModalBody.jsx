import SelectWithSearch from "@/common/select/SelectWithSearch";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { Button } from "@/common/ui/button";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import {
  BORROWER_ITEM_STATUS,
  INITIAL_BORROWER_RETURN_ITEM_LAB_OBJ,
} from "@/globals/initialValues";
import { useAddBorrowerSlipItems } from "@/hooks/borrowerSlip.hook";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { borrowerSlipReturnItemLabSchema } from "@/schemas/zodSchema";
import { LoaderCircle, Save } from "lucide-react";

export default function ReturnBorrowerSlipItemModalBody({
  extraObject,
  closeModal,
}) {
  const { itemTypeFilter, borrowerSlipId, selectedItem } = extraObject;

  const { mutate: onAddBorrowerSlipItemMutation, isPending } =
    useAddBorrowerSlipItems(closeModal);

  const borrowerItemStatus = BORROWER_ITEM_STATUS.filter((item) => {
    return itemTypeFilter === "equipments"
      ? item.value !== "4"
      : item.value !== "3" && item.value !== "4";
  });

  const form = useForm({
    resolver: zodResolver(borrowerSlipReturnItemLabSchema),
    defaultValues: INITIAL_BORROWER_RETURN_ITEM_LAB_OBJ,
  });

  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  const onSubmit = (borrowerSlipReturnItemDetails) => {
    if (
      borrowerSlipReturnItemDetails.returned_status === "2" &&
      borrowerSlipReturnItemDetails.item_damaged_quantity === 0
    ) {
      ToastNotification("error", "Quantity must be greater than 0");
      return;
    }

    if (
      Number(borrowerSlipReturnItemDetails.returned_status) > 1 &&
      borrowerSlipReturnItemDetails.item_remarks.trim() === ""
    ) {
      ToastNotification("error", "Remarks is required");
      return;
    }

    if (
      borrowerSlipReturnItemDetails.item_damaged_quantity >
      selectedItem.item_quantity
    ) {
      ToastNotification(
        "error",
        "Damaged Quantity is greater than borrowed item",
      );
      return;
    }

    const itemRemarks =
      borrowerSlipReturnItemDetails.returned_status !== "1"
        ? `${borrowerSlipReturnItemDetails.item_damaged_quantity} ${borrowerSlipReturnItemDetails.item_remarks}`
        : borrowerSlipReturnItemDetails.item_remarks;

    const forAddingData = {
      ...borrowerSlipReturnItemDetails,
      item_remarks: itemRemarks,
      borrower_slip_id: borrowerSlipId,
      id: selectedItem.id,
    };

    // console.log(forAddingData);

    onAddBorrowerSlipItemMutation({ forAddingData, isNew: false });
  };

  const onSelectValueChange = (field, value) => {
    setValue(field, value);
  };

  console.log(errors);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="my-4 -mt-2 space-y-3"
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex-[3]">
          <Label>Remarks</Label>
          <Input
            {...register("item_remarks")}
            className={"placeholder:italic"}
            placeholder="Item remarks"
          />
        </div>
        <div className="flex-[1]">
          <Label>Quantity</Label>
          <Input
            {...register("item_damaged_quantity")}
            className={"placeholder:italic"}
            placeholder="Quantity..."
            type="number"
            disabled={Number(watch("returned_status")) < 2}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SelectWithSearch
            noResultText={"Status not found"}
            placeholder={"Select Status"}
            dataArray={borrowerItemStatus}
            onSelectChange={onSelectValueChange}
            fieldName={"returned_status"}
            fieldValue={watch("returned_status")}
          />
        </div>
        <div className="flex-1">
          <Button
            variant="secondary"
            type="submit"
            disabled={isPending}
            className="w-full font-bold"
          >
            {isPending ? (
              <>
                <LoaderCircle
                  className="-ms-1 me-2 animate-spin"
                  size={16}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                Updating
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.5} className="-mr-1" />
                Update
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
