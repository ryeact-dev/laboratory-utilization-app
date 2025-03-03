import BottomButtons from "@/common/buttons/BottomButtons";
import { DatePicker } from "@/common/date-picker/DatePicker";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import ErrorText from "@/common/typography/ErrorText";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { INITIAL_STOCK_CARD_RELEASE_ITEM_OBJ } from "@/globals/initialValues";
import { useAddStockCardItems } from "@/hooks/stockCard.hook";
import { format } from "date-fns";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stockCardReleaseItemSchema } from "@/schemas/zodSchema";

const formattedDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};
export default function ReleaseStockCardItemsModalBody({
  extraObject,
  closeModal,
}) {
  const { stockCardData, stockItem, stockItemBalance, category, totalBalance } =
    extraObject;
  const { mutate: onAddStockCardItemsMutation, isPending } =
    useAddStockCardItems(closeModal);

  const form = useForm({
    resolver: zodResolver(stockCardReleaseItemSchema),
    defaultValues: stockItem
      ? {
          ...stockItem,
          date_released: new Date(stockItem.date_released),
          item_released: stockItem?.item_released.toString(),
        }
      : INITIAL_STOCK_CARD_RELEASE_ITEM_OBJ,
  });

  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  const onSubmit = (stockCardReleaseItemDetails) => {
    const currentTotalBalance = stockItem
      ? parseFloat(stockItem?.item_balance) +
        parseFloat(stockItem?.item_released)
      : parseFloat(totalBalance);

    const computedBalance =
      parseFloat(currentTotalBalance) -
      parseFloat(stockCardReleaseItemDetails.item_released);

    if (computedBalance < 0) {
      ToastNotification(
        "error",
        "Item released cannot be greater than item balance",
      );
      return;
    }

    let forAddingData = {
      ...stockCardReleaseItemDetails,
      item_balance:
        currentTotalBalance -
        parseFloat(stockCardReleaseItemDetails.item_released),
      item_name: stockCardData.item_name,
      stockcard_id: stockCardData.id,
      category,
      isLaboratoryReleased: category === "laboratory" ? true : false,
    };

    let isNew = true;

    if (stockItem) {
      isNew = false;
      forAddingData = {
        ...forAddingData,
        id: stockItem.id,
        current_item_received: parseFloat(stockItem?.item_released),
      };
    }

    console.log(forAddingData);
    // console.log(currentTotalBalance, computedBalance);

    onAddStockCardItemsMutation({ forAddingData, isNew });
  };

  const onInputChange = (value) => {
    setValue("item_released", value.toString());
  };

  return (
    <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Requisition Section */}
      <div className="border-grey-400 rounded-lg border p-4 py-6">
        <div className="mb-3 flex flex-col gap-1">
          <Label>Date Released</Label>
          <DatePicker
            date={new Date(watch("date_released"))}
            setDate={(date) => setValue("date_released", new Date(date))}
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
            <Label>Released to</Label>
            <Input {...register("released_to")} placeholder="PRS Number here" />
            <ErrorText>
              {errors?.released_to ? errors?.released_to.message : ""}
            </ErrorText>
          </div>
          <div className="flex-1">
            <Label>Quantity</Label>

            <Input
              value={watch("item_released")}
              id={"item_released"}
              name="item_released"
              placeholder="Quantity here"
              type="number"
              min={1}
              step={0.1}
              onChange={(evt) => onInputChange(evt.target.value)}
            />
            <ErrorText>
              {errors?.item_released ? errors?.item_released.message : ""}
            </ErrorText>
          </div>
        </div>

        <footer className="flex flex-col gap-3">
          <BottomButtons closeModal={closeModal} isLoading={isPending} />
        </footer>
      </div>
    </form>
  );
}
