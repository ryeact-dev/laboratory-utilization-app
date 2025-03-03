import BottomButtons from "@/common/buttons/BottomButtons";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { INITIAL_STOCK_CARD_ADD_ITEM_OBJ } from "@/globals/initialValues";
import { useAddStockCardItems } from "@/hooks/stockCard.hook";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddStockcardItemInputs from "./components/add-stockcard-item-inputs/AddStockcardItemInputs";
import { stockCardAddItemSchema } from "@/schemas/zodSchema";

export default function AddStockCardItemsModalBody({
  extraObject,
  closeModal,
}) {
  const { stockCardData, stockItem, category, stockItemBalance, isFirstItem } =
    extraObject;

  const { mutate: onAddStockCardItemsMutation, isPending } =
    useAddStockCardItems(closeModal);

  const form = useForm({
    resolver: zodResolver(stockCardAddItemSchema),
    defaultValues: stockItem
      ? {
          ...stockItem,
          date_requested: new Date(stockItem.date_requested),
          date_received: new Date(stockItem.date_received),
          item_quantity: String(stockItem.item_quantity),
          item_received: String(stockItem.item_received),
        }
      : INITIAL_STOCK_CARD_ADD_ITEM_OBJ,
  });

  // TODO: WHEN UPDATING ITEMS, ITEM BALANCE SHOULD BE UPDATED TOO

  const onSubmit = (stockCardAddItemDetails) => {
    let forAddingData;
    let isNew = true;

    if (
      stockCardAddItemDetails.date_requested >
      stockCardAddItemDetails.date_received
    ) {
      return ToastNotification(
        "error",
        "Date Requested cannot be greater than Date Received",
      );
    }

    if (
      parseFloat(stockCardAddItemDetails.item_received) >
      parseFloat(stockCardAddItemDetails.item_quantity)
    ) {
      return ToastNotification(
        "error",
        "Items received cannot be greater than item requested",
      );
    }

    if (stockItem) {
      isNew = false;

      forAddingData = {
        ...stockCardAddItemDetails,
        item_balance: isFirstItem
          ? parseFloat(stockCardAddItemDetails.item_received)
          : parseFloat(stockItemBalance) +
            parseFloat(stockCardAddItemDetails.item_received),
        current_item_received: parseFloat(stockItem.item_received),
        item_name: stockCardData.item_name,
        stockcard_id: stockCardData.id,
        id: stockItem.id,
        category,
      };
    } else {
      forAddingData = {
        ...stockCardAddItemDetails,
        item_balance:
          parseFloat(stockItemBalance) +
          parseFloat(stockCardAddItemDetails.item_received),
        item_name: stockCardData.item_name,
        stockcard_id: stockCardData.id,
        category,
      };
    }

    console.log("forAddingData", forAddingData);

    onAddStockCardItemsMutation({ forAddingData, isNew });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
      {/* Requisition Section */}
      <div className="border-grey-400 rounded-lg border p-4 py-6">
        <AddStockcardItemInputs form={form} />
        <footer className="mt-6 flex flex-col gap-3">
          <BottomButtons closeModal={closeModal} isLoading={isPending} />
        </footer>
      </div>
    </form>
  );
}
