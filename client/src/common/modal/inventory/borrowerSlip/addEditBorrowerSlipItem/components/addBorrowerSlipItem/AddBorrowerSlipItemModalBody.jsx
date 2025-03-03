import SelectWithSearch from "@/common/select/SelectWithSearch";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import ErrorText from "@/common/typography/ErrorText";
import { Button } from "@/common/ui/button";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import {
  BORROWER_ITEM_STATUS,
  INITIAL_BORROWER_RELEASE_ITEM_LAB_OBJ,
} from "@/globals/initialValues";
import { useAddBorrowerSlipItems } from "@/hooks/borrowerSlip.hook";
import { useGetReleasedLaboratoryStockCards } from "@/hooks/stockCard.hook";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { borrowerSlipItemLabSchema } from "@/schemas/zodSchema";
import { LoaderCircle, Save } from "lucide-react";

export default function AddBorrowerSlipItemModalBody({
  extraObject,
  closeModal,
}) {
  const {
    borrowerSlipItems,
    itemTypeFilter,
    borrowerSlipId,
    selectedItem,
    laboratory,
  } = extraObject;

  const { data: listOfStocks = [] } = useGetReleasedLaboratoryStockCards(
    laboratory,
    itemTypeFilter,
  );

  const { mutate: onAddBorrowerSlipItemMutation, isPending } =
    useAddBorrowerSlipItems(closeModal);

  const filteredItems = borrowerSlipItems?.filter(
    (item) => item.item_type === itemTypeFilter,
  );

  const borrowerItemStatus = BORROWER_ITEM_STATUS.filter((item) => {
    return itemTypeFilter === "equipments"
      ? item.value !== "2" && item.value !== "4"
      : item.value !== "2" && item.value !== "3";
  });

  const form = useForm({
    resolver: zodResolver(borrowerSlipItemLabSchema),
    defaultValues: selectedItem
      ? selectedItem
      : INITIAL_BORROWER_RELEASE_ITEM_LAB_OBJ,
  });

  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  const onSubmit = (borrowerSlipAddItemDetails) => {
    if (itemTypeFilter === "equipments" && filteredItems.length >= 5) {
      return ToastNotification("error", "Cannot add more than 5 items");
    }

    if (itemTypeFilter === "materials" && filteredItems.length >= 10) {
      return ToastNotification("error", "Cannot add more than 10 items");
    }

    if (Number(borrowerSlipAddItemDetails.item_quantity) < 1) {
      return ToastNotification("error", "Item quantity must be greater than 0");
    }

    const item_name = borrowerSlipAddItemDetails.item_name.split(" -- ")[0];

    const stockcard_item = listOfStocks?.find(
      (stock) => stock.value.toUpperCase() === item_name.toUpperCase(),
    );

    const remaining_balance = stockcard_item?.remaining_balance || 0;

    // Check if stock balance is sufficient
    if (
      itemTypeFilter === "materials" &&
      remaining_balance < borrowerSlipAddItemDetails.item_quantity
    ) {
      return ToastNotification("error", "Insufficient stock balance");
    }

    let releasedStatus = borrowerSlipAddItemDetails.released_status;

    if (itemTypeFilter === "materials") {
      releasedStatus =
        stockcard_item?.item_category === "Consumable" ? "4" : "1";
    }

    let isNew = true;
    let forAddingData = {
      ...borrowerSlipAddItemDetails,
      item_type: itemTypeFilter,
      borrower_slip_id: borrowerSlipId,
      released_status: releasedStatus,
      returned_status: releasedStatus,
      item_name,
      stockcard_item_id: stockcard_item?.id,
      item_unit: stockcard_item?.item_unit,
      remaining_balance,
      laboratory_name: laboratory,
    };

    if (selectedItem) {
      isNew = false;
      forAddingData = {
        ...forAddingData,
        id: selectedItem.id,
        old_item_quantity: selectedItem.item_quantity,
      };
    } else {
      // Check if item is already added
      const fountItem = filteredItems?.find(
        (item) =>
          item.item_name.toLowerCase() ===
          borrowerSlipAddItemDetails.item_name.trim().toLowerCase(),
      );
      if (fountItem) return ToastNotification("error", "Item already added");
    }

    onAddBorrowerSlipItemMutation({ forAddingData, isNew });
  };

  const onSelectValueChange = (field, value) => {
    setValue(field, value);
  };

  const onInputChange = (field, value) => {
    setValue(field, Number(value));
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="my-4 -mt-2 space-y-3"
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex-[4]">
          <Label>Name</Label>

          {itemTypeFilter === "materials" ? (
            <SelectWithSearch
              noResultText={"Item not found"}
              placeholder={"Search Item here..."}
              dataArray={listOfStocks}
              onSelectChange={onSelectValueChange}
              fieldName={"item_name"}
              fieldValue={watch("item_name")}
            />
          ) : (
            <Input {...register("item_name")} placeholder="Item name..." />
          )}

          <ErrorText>
            {errors?.item_name ? errors?.item_name.message : ""}
          </ErrorText>
        </div>
      </div>

      <div className="flex items-end gap-2">
        {/* Select box will only displays on "equipments" */}
        {itemTypeFilter === "equipments" ? (
          <div className="flex-1">
            <Label>Item Condition</Label>
            <SelectWithSearch
              noResultText={"Status not found"}
              placeholder={"Select Status"}
              dataArray={borrowerItemStatus}
              onSelectChange={onSelectValueChange}
              fieldName={"released_status"}
              fieldValue={watch("released_status")}
            />
          </div>
        ) : (
          <div className="flex-1">
            <Label>Item Quantity</Label>
            <Input
              id="item_quantity"
              name="item_quantity"
              placeholder="Item Quantity"
              onChange={(evt) =>
                onInputChange("item_quantity", evt.target.value)
              }
              type="number"
              min={1}
              step={0.1}
            />
          </div>
        )}

        <div className="w-full flex-1">
          <Button
            variant="secondary"
            type="submit"
            className="w-full font-bold"
          >
            {selectedItem?.id !== undefined ? (
              isPending ? (
                <>
                  <LoaderCircle
                    className="-ms-1 me-2 animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Updating
                </>
              ) : (
                <>
                  <Save size={16} className="-mr-1" />
                  Update
                </>
              )
            ) : isPending ? (
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
                <Save size={16} className="-mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
